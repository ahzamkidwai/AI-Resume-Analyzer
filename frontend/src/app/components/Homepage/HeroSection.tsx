import { Colors } from "@/app/styles/colors";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div>
      <section
        className="flex flex-col items-center justify-center text-center pt-32 pb-20 transition-all duration-500"
        style={{
          background: `linear-gradient(to right, ${Colors.primary.DEFAULT}, ${Colors.primary.light})`,
          color: Colors.background.white,
        }}
      >
        <motion.h2
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Resume. Perfectly Aligned.
        </motion.h2>
        <motion.p
          className="text-lg max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          FitCheck AI analyzes your resume against job descriptions, highlights
          missing keywords, and shows you how to boost your chances.
        </motion.p>
        <a
          href="/analyze"
          className="font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          style={{
            backgroundColor: Colors.background.white,
            color: Colors.primary.DEFAULT,
          }}
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default HeroSection;
