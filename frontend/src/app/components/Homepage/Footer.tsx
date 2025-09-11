import { Colors } from "@/app/styles/colors";

const Footer = () => {
  return (
    <div>
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
};

export default Footer;
