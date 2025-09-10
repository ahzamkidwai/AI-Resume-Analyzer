import { Colors } from "@/app/styles/colors";
import { motion } from "framer-motion";
import { Cpu, FileSearch, TrendingUp } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div>
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
    </div>
  );
};

export default FeaturesSection;
