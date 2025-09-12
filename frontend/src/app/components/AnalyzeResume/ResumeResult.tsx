import { Colors } from "@/app/styles/colors";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ResumeResultProps {
  result: {
    similarity: number;
    matchedKeywords: string[];
  } | null;
}

export const ResumeResult: React.FC<ResumeResultProps> = ({ result }) => {
  if (!result) return null;
  return (
    <div>
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

          {/* Accordion - Match Score */}
          <Accordion title="Match Score" defaultOpen={true}>
            <div>
              {/* <strong style={{ color: Colors.text.dark }}>Match Score: </strong> */}
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
          </Accordion>

          {/* Insights */}
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
    </div>
  );
};

export default ResumeResult;

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
        className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left"
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
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
