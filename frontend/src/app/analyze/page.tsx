"use client";

import { useState } from "react";
import { FaFileUpload, FaClipboardList, FaRobot } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Colors } from "../styles/colors";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (file === null) {
      alert("Upload resume");
      return;
    }
    if (jd.trim().length === 0) {
      alert("Upload job description");
      return;
    }

    const fd = new FormData();
    if (file) fd.append("file", file);
    if (jd.trim()) fd.append("jobDescription", jd);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to analyze");

      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      alert("Error analyzing: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen font-sans flex flex-col items-center px-4 sm:px-6 lg:px-12 py-8"
      style={{ backgroundColor: Colors.background.light }}
    >
      {/* Hero Section */}
      <section className="text-center max-w-2xl mt-8 sm:mt-12">
        <FaRobot
          className="text-5xl sm:text-6xl mx-auto mb-4"
          style={{ color: Colors.primary.DEFAULT }}
        />
        <h1
          className="text-2xl sm:text-4xl font-bold"
          style={{ color: Colors.text.dark }}
        >
          AI Resume & Job Match Analyzer
        </h1>
        <p
          className="mt-3 text-base sm:text-lg leading-relaxed px-2"
          style={{ color: Colors.text.medium }}
        >
          Upload your resume or paste a job description, and let AI analyze the
          match instantly.
        </p>
      </section>

      {/* Form Section */}
      <form
        onSubmit={submit}
        className="shadow-lg rounded-2xl p-5 sm:p-6 md:p-8 mt-8 sm:mt-10 w-full max-w-md sm:max-w-xl lg:max-w-2xl space-y-5"
        style={{ backgroundColor: Colors.background.white }}
      >
        {/* Resume Upload */}
        <label className="block">
          <span
            className="flex items-center gap-2 font-medium text-sm sm:text-base"
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
            <p
              className="mt-2 text-xs sm:text-sm"
              style={{ color: Colors.text.medium }}
            >
              Selected: {file.name}
            </p>
          )}
        </label>

        {/* Job Description */}
        <label className="block">
          <span
            className="flex items-center gap-2 font-medium text-sm sm:text-base"
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
            className="mt-2 block w-full border rounded-lg p-3 text-sm focus:ring-2 resize-none"
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
          className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base disabled:opacity-50"
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
          className="shadow-md rounded-2xl p-5 sm:p-6 md:p-8 mt-8 w-full max-w-md sm:max-w-xl lg:max-w-2xl space-y-4"
          style={{ backgroundColor: Colors.background.white }}
        >
          <h2
            className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
            style={{ color: Colors.text.dark }}
          >
            Analysis Results
          </h2>

          {/* Accordion - Match Score */}
          <Accordion title="Match Score" defaultOpen={true}>
            <div>
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
          </Accordion>

          {/* Accordion - Matched Keywords */}
          <Accordion title="Matched Keywords">
            <div>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(result.matchedKeywords) &&
                result.matchedKeywords.length > 0 ? (
                  result.matchedKeywords.map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
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
          </Accordion>

          {/* Insights */}
          <div
            className="pt-3 border-t"
            style={{ borderColor: Colors.border.DEFAULT }}
          >
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: Colors.text.medium }}
            >
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

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 font-semibold text-left text-sm sm:text-base"
        style={{ color: Colors.text.dark }}
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2"
        >
          ▶
        </motion.span>
      </button>

      {/* Animated Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="px-3 sm:px-4 pb-3 sm:pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
