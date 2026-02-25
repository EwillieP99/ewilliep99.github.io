import { Routes, Route } from "react-router-dom";
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
import { CyberPhotosPage } from "./components/gallery/CyberPhotosPage.jsx";
import { useMousePosition } from "./hooks/useMousePosition.js";
import { useReducedMotion } from "./hooks/useReducedMotion.js";

// Set to false to hide the Writing section
const SHOW_WRITING = true;

function HomePage() {
  const { x, y } = useMousePosition();
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 relative">
      {/* Fixed gradient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, #0b1024 0%, #111942 45%, #1c1240 75%, #101838 100%)",
        }}
      />

      {/* Cursor glow — hidden on mobile and when reduced motion is preferred */}
      {!prefersReduced && (
        <div
          className="fixed inset-0 pointer-events-none z-[5] hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(56,189,248,0.1), transparent 70%)`,
          }}
        />
      )}

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/photos" element={<CyberPhotosPage />} />
    </Routes>
  );
}
