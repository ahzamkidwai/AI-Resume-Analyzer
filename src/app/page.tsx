"use client";

import { CheckCircle, Cpu, FileSearch, TrendingUp } from "lucide-react";
import { Colors } from "./styles/colors";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      className="min-h-screen scroll-smooth"
      style={{
        backgroundColor: Colors.background.light,
        color: Colors.text.dark,
      }}
    >
      {/* Navbar */}
      <nav
        className="fixed w-full top-0 z-50 shadow-md transition-all duration-300"
        style={{ backgroundColor: Colors.background.white }}
      >
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <h1
            className="text-2xl font-bold cursor-pointer transition-transform hover:scale-105"
            style={{ color: Colors.primary.DEFAULT }}
          >
            FitCheck AI
          </h1>
          <ul
            className="flex space-x-8 font-medium"
            style={{ color: Colors.text.medium }}
          >
            <li>
              <a
                href="#features"
                className="hover:underline transition"
                style={{ color: Colors.text.medium }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how"
                className="hover:underline transition"
                style={{ color: Colors.text.medium }}
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:underline transition"
                style={{ color: Colors.text.medium }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h3
          className="text-3xl font-bold text-center mb-12"
          style={{ color: Colors.text.dark }}
        >
          Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: FileSearch,
              title: "Resume Analysis",
              desc: "Upload your resume and job description to get instant analysis.",
            },
            {
              icon: Cpu,
              title: "AI-Powered Insights",
              desc: "Advanced AI models check keyword matches, skills, and relevance.",
            },
            {
              icon: TrendingUp,
              title: "Match Score",
              desc: "See how well your resume fits with a clear, professional score.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl shadow transition-transform hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: Colors.background.white }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <feature.icon
                className="w-12 h-12 mb-4"
                style={{ color: Colors.primary.DEFAULT }}
              />
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p style={{ color: Colors.text.medium }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
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

      {/* Footer */}
      <footer
        id="contact"
        className="text-center py-6 mt-20 transition-all duration-300"
        style={{
          backgroundColor: Colors.primary.DEFAULT,
          color: Colors.background.white,
        }}
      >
        <p>© {new Date().getFullYear()} FitCheck AI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
