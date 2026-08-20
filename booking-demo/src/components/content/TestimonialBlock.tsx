interface TestimonialBlockProps {
  text: string;
  author: string;
}

export default function TestimonialBlock({ text, author }: TestimonialBlockProps) {
  return (
    <blockquote className="testimonial">
      <p className="testimonial__text">&ldquo;{text}&rdquo;</p>
      <footer className="testimonial__author">— {author}</footer>
    </blockquote>
  );
}
