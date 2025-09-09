"use client";

import React, { useState } from "react";
import { FaFileUpload, FaClipboardList, FaRobot } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file && !jd.trim()) {
      alert("Upload resume or enter job description");
      return;
    }

    const fd = new FormData();
    if (file) fd.append("resume", file);
    fd.append("jobDescription", jd);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to analyze");
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans flex flex-col items-center p-6">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mt-12">
        <FaRobot className="text-indigo-600 text-6xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">
          AI Resume & Job Match Analyzer
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Upload your resume or paste a job description, and let AI analyze the
          match instantly.
        </p>
      </section>

      {/* Form Section */}
      <form
        onSubmit={submit}
        className="bg-white shadow-lg rounded-2xl p-6 mt-10 w-full max-w-xl space-y-5"
      >
        <label className="block">
          <span className="flex items-center gap-2 font-medium text-gray-700">
            <FaFileUpload className="text-indigo-500" /> Upload Resume
            (PDF/DOCX)
          </span>
          <input
            type="file"
            accept=".pdf,.docx"
            className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <label className="block">
          <span className="flex items-center gap-2 font-medium text-gray-700">
            <FaClipboardList className="text-green-500" /> Paste Job Description
          </span>
          <textarea
            rows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description here..."
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" /> Analyzing…
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <section className="bg-white shadow-md rounded-2xl p-6 mt-8 w-full max-w-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
          <div className="mb-3">
            <strong className="text-gray-700">Similarity Score: </strong>
            <span
              className={`px-2 py-1 rounded-md text-white ${
                result.similarity > 0.7
                  ? "bg-green-500"
                  : result.similarity > 0.4
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {typeof result.similarity === "number"
                ? result.similarity.toFixed(3)
                : "—"}
            </span>
          </div>
          <div>
            <strong className="text-gray-700">Matched Keywords: </strong>
            {Array.isArray(result.matchedKeywords) &&
            result.matchedKeywords.length > 0 ? (
              <span className="text-gray-800">
                {result.matchedKeywords.join(", ")}
              </span>
            ) : (
              "—"
            )}
          </div>
        </section>
      )}
    </main>
  );
}
