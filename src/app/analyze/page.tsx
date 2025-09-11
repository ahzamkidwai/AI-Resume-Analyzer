"use client";

import { useState } from "react";
import { FaFileUpload, FaClipboardList, FaRobot } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Colors } from "../styles/colors";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    console.log("📥 Form submitted");

    if (!file && !jd.trim()) {
      console.warn("⚠️ No resume or job description provided");
      alert("Upload resume or enter job description");
      return;
    }

    const fd = new FormData();
    if (file) {
      fd.append("file", file);
      console.log(`📂 File appended: ${file.name}`);
    }
    if (jd.trim()) {
      fd.append("jobDescription", jd);
      console.log("📝 Job description appended");
    }

    setLoading(true);
    setResult(null);
    console.log("⏳ Analyzing started, loading state set");

    try {
      console.log("🚀 Sending request to /api/analyze...");
      const res = await fetch("/api/analyze", { method: "POST", body: fd });

      if (!res.ok) {
        console.error("❌ API request failed with status:", res.status);
        throw new Error("Failed to analyze");
      }

      console.log("✅ API response received");
      const json = await res.json();
      console.log("📊 Analysis result:", json);

      setResult(json);
    } catch (err: any) {
      console.error("🚨 Error analyzing:", err.message);
      alert("Error analyzing: " + err.message);
    } finally {
      setLoading(false);
      console.log("🏁 Analysis finished, loading state reset");
    }
  }

  return (
    <main
      className="min-h-screen font-sans flex flex-col items-center p-6"
      style={{ backgroundColor: Colors.background.light }}
    >
      {/* Hero Section */}
      <section className="text-center max-w-2xl mt-12">
        <FaRobot
          className="text-6xl mx-auto mb-4"
          style={{ color: Colors.primary.DEFAULT }}
        />
        <h1 className="text-4xl font-bold" style={{ color: Colors.text.dark }}>
          AI Resume & Job Match Analyzer
        </h1>
        <p className="mt-2 text-lg" style={{ color: Colors.text.medium }}>
          Upload your resume or paste a job description, and let AI analyze the
          match instantly.
        </p>
      </section>

      {/* Form Section */}
      <form
        onSubmit={submit}
        className="shadow-lg rounded-2xl p-6 mt-10 w-full max-w-xl space-y-5"
        style={{ backgroundColor: Colors.background.white }}
      >
        {/* Resume Upload */}
        <label className="block">
          <span
            className="flex items-center gap-2 font-medium"
            style={{ color: Colors.text.dark }}
          >
            <FaFileUpload style={{ color: Colors.primary.DEFAULT }} /> Upload
            Resume (PDF/DOCX)
          </span>
          <input
            type="file"
            accept=".pdf,.docx"
            className="mt-2 block w-full border rounded-lg p-2 text-sm focus:ring-2"
            style={{
              borderColor: Colors.border.DEFAULT,
              color: Colors.text.medium,
            }}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="mt-2 text-sm" style={{ color: Colors.text.medium }}>
              Selected: {file.name}
            </p>
          )}
        </label>

        {/* Job Description */}
        <label className="block">
          <span
            className="flex items-center gap-2 font-medium"
            style={{ color: Colors.text.dark }}
          >
            <FaClipboardList style={{ color: Colors.success.DEFAULT }} /> Paste
            Job Description
          </span>
          <textarea
            rows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description here..."
            className="mt-2 block w-full border rounded-lg p-3 text-sm focus:ring-2"
            style={{
              borderColor: Colors.border.DEFAULT,
              color: Colors.text.medium,
            }}
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          style={{
            backgroundColor: Colors.primary.DEFAULT,
            color: Colors.background.white,
          }}
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
        <section
          className="shadow-md rounded-2xl p-6 mt-8 w-full max-w-xl"
          style={{ backgroundColor: Colors.background.white }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: Colors.text.dark }}
          >
            Results
          </h2>
          <div className="mb-3">
            <strong style={{ color: Colors.text.dark }}>
              Similarity Score:{" "}
            </strong>
            <span
              className="px-2 py-1 rounded-md text-white"
              style={{
                backgroundColor:
                  result.similarity > 0.7
                    ? Colors.success.DEFAULT
                    : result.similarity > 0.4
                    ? Colors.warning.DEFAULT
                    : Colors.danger.DEFAULT,
              }}
            >
              {typeof result.similarity === "number"
                ? result.similarity.toFixed(3)
                : "—"}
            </span>
          </div>
          <div>
            <strong style={{ color: Colors.text.dark }}>
              Matched Keywords:{" "}
            </strong>
            {Array.isArray(result.matchedKeywords) &&
            result.matchedKeywords.length > 0 ? (
              <span style={{ color: Colors.text.medium }}>
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
