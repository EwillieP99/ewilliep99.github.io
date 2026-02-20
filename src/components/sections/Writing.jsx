import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { Tag } from "../ui/Tag.jsx";
import { posts } from "../../data/writing.js";

function PostCard({ post, index }) {
  return (
    <AnimatedSection delay={index * 0.07}>
      <GlassCard padding="p-6" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-500">{post.date}</span>
          <div className="flex gap-1.5">
            {post.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        </div>
        <h3 className="font-semibold text-slate-100 leading-snug">{post.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed flex-1">{post.excerpt}</p>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-blue hover:underline mt-1 self-start"
        >
          Read →
        </a>
      </GlassCard>
    </AnimatedSection>
  );
}

export function Writing() {
  return (
    <section id="writing" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="Writing" sub="Thinking out loud" />
      </AnimatedSection>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
