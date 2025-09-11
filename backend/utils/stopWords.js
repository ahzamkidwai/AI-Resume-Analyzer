const stopWords = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "in",
  "for",
  "with",
  "on",
  "of",
  "at",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "this",
  "that",
  "it",
  "as",
  "but",
  "if",
  "not",
  "your",
  "you",
  "we",
  "our",
  "i",
  "my",
]);

function removeStopWords(words) {
  return words.filter((word) => !stopWords.has(word.toLowerCase()));
}

module.exports = { removeStopWords };
