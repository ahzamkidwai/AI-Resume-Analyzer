async function queryHuggingFace(model, text, features) {
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${model}/pipeline/${
      features || "feature-extraction"
    }`,
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
  if (Array.isArray(data[0])) {
    return [{ embedding: data[0] }];
  }

  return data;
}

async function queryNER(text) {
  const response = await fetch("http://localhost:8000/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`NER API error: ${response.status}`);
  }

  const data = await response.json();
  return data.entities;
}

module.exports = { queryHuggingFace, queryNER };
