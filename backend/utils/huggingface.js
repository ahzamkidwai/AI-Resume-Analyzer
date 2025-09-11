async function queryHuggingFace(model, text) {
  console.log("Querying Hugging Face model:", model);
  console.log("Text length:", text);
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const data = await response.json();
  console.log("Hugging Face response data:", data);

  if (Array.isArray(data[0])) {
    return [{ embedding: data[0] }];
  }

  return data;
}

module.exports = { queryHuggingFace };
