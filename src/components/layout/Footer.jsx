import { meta } from "../../data/meta.js";

export function Footer() {
  return (
    <footer className="border-t border-white/6 py-8 mt-24">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <span>
          © {new Date().getFullYear()} {meta.name}
        </span>
        <div className="flex items-center gap-6">
          {meta.linkedinUrl && (
            <a href={meta.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
              LinkedIn
            </a>
          )}
          {meta.githubUrl && (
            <a href={meta.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
              GitHub
            </a>
          )}
          {meta.twitterUrl && (
            <a href={meta.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
              Twitter
            </a>
          )}
          <a href={`mailto:${meta.email}`} className="hover:text-accent-blue transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
