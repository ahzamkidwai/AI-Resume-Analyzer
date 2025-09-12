from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import torch

# ----------------------------
# FastAPI Initialization
# ----------------------------
app = FastAPI(title="Resume NER Service", version="2.0")

# ----------------------------
# Load Model
# ----------------------------
MODEL_NAME = "yashpwr/resume-ner-bert-v2"

print("Loading model... (this may take a minute)")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForTokenClassification.from_pretrained(MODEL_NAME)

# Hugging Face pipeline (simple mode)
ner_pipeline = pipeline(
    "token-classification",
    model=model,
    tokenizer=tokenizer,
    aggregation_strategy="simple"
)

print("Model loaded successfully!")

# ----------------------------
# Request & Response Schemas
# ----------------------------
class ResumeText(BaseModel):
    text: str
    confidence_threshold: float = 0.5
    mode: str = "simple"  # "simple" | "advanced"

class Entity(BaseModel):
    label: str
    text: str
    start: int
    end: int
    confidence: float

# ----------------------------
# Advanced Extraction Function
# ----------------------------
def extract_entities_with_confidence(text: str, confidence_threshold: float = 0.5):
    """Custom NER extraction with confidence + offsets."""
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=256,
        padding=True,
        return_offsets_mapping=True
    )

    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.argmax(outputs.logits, dim=2)
        probabilities = torch.softmax(outputs.logits, dim=2)

    entities = []
    current_entity = None
    offset_mapping = inputs["offset_mapping"][0]

    for i, (pred, offset) in enumerate(zip(predictions[0], offset_mapping)):
        label = model.config.id2label[pred.item()]
        confidence = probabilities[0][i][pred].item()

        # Skip special tokens
        if offset[0] == 0 and offset[1] == 0:
            continue

        if label.startswith("B-"):
            if current_entity and current_entity["confidence"] >= confidence_threshold:
                entities.append(current_entity)

            entity_type = label[2:]
            current_entity = {
                "label": entity_type,
                "text": text[offset[0]:offset[1]],
                "start": offset[0],
                "end": offset[1],
                "confidence": confidence,
            }

        elif label.startswith("I-") and current_entity:
            entity_type = label[2:]
            if entity_type == current_entity["label"]:
                current_entity["text"] += " " + text[offset[0]:offset[1]]
                current_entity["end"] = offset[1]
                current_entity["confidence"] = min(current_entity["confidence"], confidence)

        elif label == "O":
            if current_entity and current_entity["confidence"] >= confidence_threshold:
                entities.append(current_entity)
                current_entity = None

    if current_entity and current_entity["confidence"] >= confidence_threshold:
        entities.append(current_entity)

    return entities

# ----------------------------
# API Endpoint
# ----------------------------
@app.post("/extract", response_model=List[Entity])
def extract_entities(resume: ResumeText):
    """
    Extract entities from resume text.
    Mode = "simple" -> uses pipeline
    Mode = "advanced" -> custom extraction with confidence scores
    """
    if resume.mode == "simple":
        results = ner_pipeline(resume.text)
        entities = [
            Entity(
                label=r["entity_group"],
                text=r["word"],
                start=r["start"],
                end=r["end"],
                confidence=r["score"],
            )
            for r in results if r["score"] >= resume.confidence_threshold
        ]
    else:
        entities = [
            Entity(**entity)
            for entity in extract_entities_with_confidence(
                resume.text, resume.confidence_threshold
            )
        ]

    return entities

# ----------------------------
# Health Check
# ----------------------------
@app.get("/health")
def health_check():
    return {"status": "OK", "model": MODEL_NAME}
