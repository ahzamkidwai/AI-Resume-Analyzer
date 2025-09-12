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
  console.log("Matched Keywords:", result?.matchedKeywords);
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
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: fd,
      });

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
          className="shadow-md rounded-2xl p-6 mt-8 w-full max-w-xl space-y-4"
          style={{ backgroundColor: Colors.background.white }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: Colors.text.dark }}
          >
            Analysis Results
          </h2>

          {/* Similarity Score */}
          <div>
            <strong style={{ color: Colors.text.dark }}>Match Score: </strong>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="h-4 rounded-full text-xs flex items-center justify-center text-white font-medium"
                style={{
                  width: `${(result.similarity * 100).toFixed(0)}%`,
                  backgroundColor:
                    result.similarity > 0.7
                      ? Colors.success.DEFAULT
                      : result.similarity > 0.4
                      ? Colors.warning.DEFAULT
                      : Colors.danger.DEFAULT,
                }}
              >
                {(result.similarity * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Matched Keywords */}
          <div>
            <strong style={{ color: Colors.text.dark }}>
              Matched Keywords:
            </strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(result.matchedKeywords) &&
              result.matchedKeywords.length > 0 ? (
                result.matchedKeywords.map((kw: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: Colors.primary.light,
                      color: Colors.primary.dark,
                    }}
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span style={{ color: Colors.text.medium }}>
                  No keywords matched
                </span>
              )}
            </div>
          </div>

          {/* Insights (Optional) */}
          <div
            className="pt-3 border-t"
            style={{ borderColor: Colors.border.DEFAULT }}
          >
            <p className="text-sm" style={{ color: Colors.text.medium }}>
              ✅ High score means your resume aligns well with the job
              description. Aim for at least <strong>70%</strong> for strong ATS
              compatibility.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
