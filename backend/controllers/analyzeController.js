// const pdf = require("pdf-parse");
// const { queryHuggingFace } = require("../utils/huggingface");
// const { removeStopWords } = require("../utils/stopWords");

// async function analyze(req, res) {
//   try {
//     const file = req.file;
//     const jobDescription = req.body.jobDescription;

//     if (!file && !jobDescription) {
//       return res
//         .status(400)
//         .json({ error: "No file or job description provided" });
//     }

//     let resumeText = "";

//     if (file) {
//       const buffer = file.buffer;
//       const parsed = await pdf(buffer);
//       resumeText = parsed.text.trim();
//       console.log(`📄 Resume text extracted (${resumeText.length} chars)`);
//       console.log("Resume Text is : " + resumeText);
//     }

//     if (!resumeText && jobDescription) {
//       return res.json({ text: jobDescription });
//     }

//     if (resumeText && jobDescription) {
//       const embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";

//       const resumeEmbedding = await queryHuggingFace(
//         embeddingModel,
//         resumeText
//       );

//       const jdEmbedding = await queryHuggingFace(
//         embeddingModel,
//         jobDescription
//       );

//       const dot =
//         resumeEmbedding.reduce(
//           (sum, val, i) => sum + val * jdEmbedding[i],
//           0
//         ) || 0;

//       const normA = Math.sqrt(
//         resumeEmbedding.reduce((sum, val) => sum + val * val, 0)
//       );
//       const normB = Math.sqrt(
//         jdEmbedding.reduce((sum, val) => sum + val * val, 0)
//       );

//       const similarity = dot / (normA * normB);

//       const jdWords = removeStopWords(
//         jobDescription.toLowerCase().split(/\W+/).filter(Boolean)
//       );
//       const resumeWords = removeStopWords(
//         resumeText.toLowerCase().split(/\W+/)
//       );
//       const matchedKeywords = jdWords.filter((word) =>
//         resumeWords.includes(word)
//       );

//       console.log(`🔍 Similarity: ${similarity}`);
//       console.log(`🔑 Matched Keywords: ${matchedKeywords.join(", ")}`);

//       return res.json({ similarity, matchedKeywords });
//     }

//     return res.json({ text: resumeText });
//   } catch (err) {
//     console.error("🚨 Error analyzing resume:", err.message);
//     res.status(500).json({ error: "Failed to analyze resume/job description" });
//   }
// }

// module.exports = { analyze };

const { queryHuggingFace, queryNER } = require("../utils/huggingface");
const { removeStopWords } = require("../utils/stopWords");
const pdf = require("pdf-parse");

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
      const embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";
      const resumeRaw = await queryHuggingFace(
        embeddingModel,
        resumeText,
        "feature-extraction"
      );
      const jdRaw = await queryHuggingFace(
        embeddingModel,
        jobDescription,
        "feature-extraction"
      );

      const resumeVec = getEmbeddingVector(resumeRaw);
      const jdVec = getEmbeddingVector(jdRaw);

      const similarity = cosineSimilarity(resumeVec, jdVec);
      const nerEntities = await queryNER(resumeText);

      const jdWords = removeStopWords(
        jobDescription.toLowerCase().split(/\W+/).filter(Boolean)
      );
      const resumeWords = removeStopWords(
        resumeText.toLowerCase().split(/\W+/)
      );
      const matchedKeywords = jdWords.filter((word) =>
        resumeWords.includes(word)
      );

      return res.json({
        similarity,
        matchedKeywords,
        entities: nerEntities,
      });
    }

    res.json({ text: resumeText || jobDescription });
  } catch (err) {
    console.error("🚨 Error analyzing resume:", err);
    res.status(500).json({ error: "Failed to analyze resume/job description" });
  }
}

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
  // Accept many shapes and return a single vector: [number, number, ...]
  // raw can be:
  //  - [num, num, ...]  => already a vector
  //  - [[num...], [num...], ...] => token embeddings -> mean pool
  //  - [{ embedding: [...] }] => return first.embedding
  //  - { embedding: [...] } => return embedding
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "number") {
    // already a vector
    return raw;
  }

  if (
    Array.isArray(raw) &&
    raw.length > 0 &&
    Array.isArray(raw[0]) &&
    typeof raw[0][0] === "number"
  ) {
    // token-level embeddings: array of vectors -> mean pool
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

  // If your queryHuggingFace returns something like {0: [...], 1: [...]} (unusual) you may need to adapt here.
  throw new Error(
    "Unsupported embedding shape from queryHuggingFace: " +
      JSON.stringify(
        Array.isArray(raw) ? (raw.length > 3 ? raw.slice(0, 3) : raw) : raw
      ).slice(0, 400)
  );
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

  console.log("Vector A length:", vecA.length);
  console.log("Vector B length:", vecB.length);

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

  if (normA === 0 || normB === 0) return 0; // avoid divide-by-zero
  return dot / (normA * normB);
}

module.exports = { analyze };
