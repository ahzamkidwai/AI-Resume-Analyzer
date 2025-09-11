const pdf = require("pdf-parse");
const { queryHuggingFace } = require("../utils/huggingface");
const { removeStopWords } = require("../utils/stopWords");

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
      console.log(`📄 Resume text extracted (${resumeText.length} chars)`);
      console.log("Resume Text is : " + resumeText);
    }

    if (!resumeText && jobDescription) {
      return res.json({ text: jobDescription });
    }

    if (resumeText && jobDescription) {
      const embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";

      const resumeEmbedding = await queryHuggingFace(
        embeddingModel,
        resumeText
      );

      const jdEmbedding = await queryHuggingFace(
        embeddingModel,
        jobDescription
      );

      const dot =
        resumeEmbedding.reduce(
          (sum, val, i) => sum + val * jdEmbedding[i],
          0
        ) || 0;

      const normA = Math.sqrt(
        resumeEmbedding.reduce((sum, val) => sum + val * val, 0)
      );
      const normB = Math.sqrt(
        jdEmbedding.reduce((sum, val) => sum + val * val, 0)
      );

      const similarity = dot / (normA * normB);

      const jdWords = removeStopWords(
        jobDescription.toLowerCase().split(/\W+/).filter(Boolean)
      );
      const resumeWords = removeStopWords(
        resumeText.toLowerCase().split(/\W+/)
      );
      const matchedKeywords = jdWords.filter((word) =>
        resumeWords.includes(word)
      );

      console.log(`🔍 Similarity: ${similarity}`);
      console.log(`🔑 Matched Keywords: ${matchedKeywords.join(", ")}`);

      return res.json({ similarity, matchedKeywords });
    }

    return res.json({ text: resumeText });
  } catch (err) {
    console.error("🚨 Error analyzing resume:", err.message);
    res.status(500).json({ error: "Failed to analyze resume/job description" });
  }
}

module.exports = { analyze };
