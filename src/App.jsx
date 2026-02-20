import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { Hero } from "./components/sections/Hero.jsx";
import { Reel } from "./components/sections/Reel.jsx";
import { About } from "./components/sections/About.jsx";
import { Experience } from "./components/sections/Experience.jsx";
import { Projects } from "./components/sections/Projects.jsx";
import { Skills } from "./components/sections/Skills.jsx";
import { Contact } from "./components/sections/Contact.jsx";
import { Writing } from "./components/sections/Writing.jsx";

// Set to false to hide the Writing section
const SHOW_WRITING = true;

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 relative">
      {/* Fixed gradient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, #060818 0%, #0a0f2e 45%, #140a2e 75%, #090f28 100%)",
        }}
      />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Reel />
        <About />
        <Experience />
        <Projects />
        <Skills />
        {SHOW_WRITING && <Writing />}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
