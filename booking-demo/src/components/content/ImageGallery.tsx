import type { SiteImage } from '../../data/content/imageManifest';
import { assetUrl } from '../../shared/assetUrl';

interface ImageGalleryProps {
  images: SiteImage[] | { src: string; alt: string }[];
  columns?: 2 | 3 | 4;
}

export default function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  if (!images.length) return null;
  return (
    <div className={`image-grid image-grid--${columns}`}>
      {images.map((img) => (
        <figure key={img.src} className="image-grid__item">
          <img src={assetUrl(img.src)} alt={img.alt} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}
