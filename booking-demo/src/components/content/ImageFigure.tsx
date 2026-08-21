import { assetUrl } from '../../shared/assetUrl';

interface ImageFigureProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ImageFigure({ src, alt, caption }: ImageFigureProps) {
  return (
    <figure className="image-figure">
      <img src={assetUrl(src)} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
