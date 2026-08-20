import type { ReactNode } from 'react';

interface ProseSectionProps {
  heading?: string;
  children: ReactNode;
  className?: string;
}

export default function ProseSection({ heading, children, className }: ProseSectionProps) {
  return (
    <section className={`prose-section${className ? ` ${className}` : ''}`}>
      {heading && <h2>{heading}</h2>}
      <div className="prose">{children}</div>
    </section>
  );
}
