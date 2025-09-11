import { Colors } from "@/app/styles/colors";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Working = () => {
  return (
    <div>
      <section
        id="how"
        className="py-20 px-6 flex justify-center"
        style={{ backgroundColor: Colors.background.light }}
      >
        <motion.div
          className="max-w-4xl w-full p-10 rounded-2xl shadow-lg"
          style={{ backgroundColor: Colors.background.white }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3
            className="text-3xl font-bold text-center mb-12"
            style={{ color: Colors.text.dark }}
          >
            How it Works
          </h3>
          <div className="space-y-6 text-lg">
            {[
              "Upload your resume (PDF/DOCX).",
              "Paste the job description of your target role.",
              "Get instant match score + missing keywords to improve your resume.",
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <CheckCircle
                  className="w-7 h-7 mt-1"
                  style={{ color: Colors.success.DEFAULT }}
                />
                <p style={{ color: Colors.text.medium }}>{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Working;
