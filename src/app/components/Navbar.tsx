import { Colors } from "../styles/colors";

const Navbar = () => {
  return (
    <div>
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
    </div>
  );
};

export default Navbar;
