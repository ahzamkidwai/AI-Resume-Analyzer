const { queryHuggingFace, queryNER } = require("../utils/huggingface");
const { removeStopWords } = require("../utils/stopWords");
const pdf = require("pdf-parse");
const { synonyms } = require("../utils/synonyms");

async function analyze(req, res) {
  try {
    const file = req.file;
    const jobDescription = req.body.jobDescription;

    if (!file && !jobDescription) {
      return res
        .status(400)
        .json({ error: "No file or job description provided" });
    }

    let resumeText = "";
    if (file) {
      const buffer = file.buffer;
      const parsed = await pdf(buffer);
      resumeText = parsed.text.trim();
    }

    if (resumeText && jobDescription) {
      // const embeddingModel = "sentence-transformers/all-mpnet-base-v2"; // 🔹 better semantic accuracy
      const embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";

      const resumeRaw = await queryHuggingFace(embeddingModel, resumeText);
      const jdRaw = await queryHuggingFace(embeddingModel, jobDescription);
      const nerEntities = await queryNER(resumeText);

      const resumeVec = getEmbeddingVector(resumeRaw);
      const jdVec = getEmbeddingVector(jdRaw);

      const similarity = cosineSimilarity(resumeVec, jdVec);

      // 🔹 Keyword preprocessing with stopwords + synonyms
      let jdWords = preprocessKeywords(jobDescription);
      let resumeWords = preprocessKeywords(resumeText);

      const matchedKeywords = jdWords.filter((word) =>
        resumeWords.includes(word)
      );
      const missingKeywords = jdWords.filter(
        (word) => !resumeWords.includes(word)
      );

      // 🔹 Compute weighted score (50% cosine, 50% keyword overlap)
      const keywordScore =
        jdWords.length > 0 ? matchedKeywords.length / jdWords.length : 0;
      const finalScore = (similarity * 0.5 + keywordScore * 0.5) * 100;

      return res.json({
        similarity: similarity.toFixed(4),
        keywordScore: keywordScore.toFixed(4),
        finalScore: finalScore.toFixed(2) + "%",
        matchedKeywords,
        missingKeywords,
        entities: nerEntities,
      });
    }

    res.json({ text: resumeText || jobDescription });
  } catch (err) {
    console.error("🚨 Error analyzing resume:", err);
    res.status(500).json({ error: "Failed to analyze resume/job description" });
  }
}

// 🔹 Helper: preprocess keywords (normalize + remove stopwords + expand synonyms)
function preprocessKeywords(text) {
  return removeStopWords(
    text
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .map((w) => synonyms[w] || w) // synonym expansion
  );
}

// Mean pooling for token embeddings
function meanPooling(tokenEmbeddings) {
  if (!Array.isArray(tokenEmbeddings) || tokenEmbeddings.length === 0) {
    throw new Error(
      "meanPooling expects a non-empty array of token embeddings"
    );
  }
  const dim = tokenEmbeddings[0].length;
  const pooled = new Array(dim).fill(0);
  tokenEmbeddings.forEach((vec) => {
    for (let i = 0; i < dim; i++) pooled[i] += vec[i];
  });
  return pooled.map((v) => v / tokenEmbeddings.length);
}

function getEmbeddingVector(raw) {
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "number") {
    return raw; // already a vector
  }
  if (
    Array.isArray(raw) &&
    raw.length > 0 &&
    Array.isArray(raw[0]) &&
    typeof raw[0][0] === "number"
  ) {
    return meanPooling(raw);
  }
  if (
    Array.isArray(raw) &&
    raw.length > 0 &&
    raw[0] &&
    Array.isArray(raw[0].embedding)
  ) {
    return raw[0].embedding;
  }
  if (raw && Array.isArray(raw.embedding)) {
    return raw.embedding;
  }
  throw new Error("Unsupported embedding shape from queryHuggingFace");
}

function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    throw new Error("cosineSimilarity expects arrays");
  }
  if (vecA.length !== vecB.length) {
    throw new Error(
      `Embedding dims mismatch: ${vecA.length} vs ${vecB.length}`
    );
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

module.exports = { analyze };
