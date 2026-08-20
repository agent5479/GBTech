import type { ReactNode } from 'react';

interface AnchorSectionProps {
  id: string;
  heading: string;
  children: ReactNode;
  className?: string;
}

export default function AnchorSection({ id, heading, children, className }: AnchorSectionProps) {
  return (
    <section id={id} className={`anchor-section${className ? ` ${className}` : ''}`}>
      <h2>{heading}</h2>
      {children}
    </section>
  );
}
