'use client'; // For onClickImage handler if it involves client-side logic

import PhotoGallery from '@/components/custom/photo-gallery';

const sampleImages = [
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+1',
    alt: 'Placeholder Image 1',
  },
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+2',
    alt: 'Placeholder Image 2',
  },
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+3',
    alt: 'Placeholder Image 3',
  },
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+4',
    alt: 'Placeholder Image 4',
  },
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+5',
    alt: 'Placeholder Image 5',
  },
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+6',
    alt: 'Placeholder Image 6',
  },
  {
    src: 'https://via.placeholder.com/300x300.png?text=Image+7',
    alt: 'Placeholder Image 7',
  },
];

const fewImages = [
  {
    src: 'https://via.placeholder.com/600x400.png?text=Slide+A',
    alt: 'Placeholder Slide A',
  },
  {
    src: 'https://via.placeholder.com/600x400.png?text=Slide+B',
    alt: 'Placeholder Slide B',
  },
  {
    src: 'https://via.placeholder.com/600x400.png?text=Slide+C',
    alt: 'Placeholder Slide C',
  },
];

export default function PhotoGalleryDemoPage() {
  const handleImageClick = (
    image: { src: string; alt: string },
    index: number
  ) => {
    alert(`Clicked image: ${image.alt} (index: ${index}, src: ${image.src})`);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">PhotoGallery Component Demo</h1>

      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Grid Layout</h2>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Default grid layout. Click an image to trigger an alert.
        </p>
        <PhotoGallery images={sampleImages} onClickImage={handleImageClick} />
      </section>

      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Carousel Layout</h2>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Basic carousel functionality.
        </p>
        <PhotoGallery
          images={fewImages}
          layout="carousel"
          onClickImage={handleImageClick}
        />
      </section>

      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Carousel Layout (Single Image)
        </h2>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Carousel with a single image (controls should be hidden).
        </p>
        <PhotoGallery
          images={[fewImages[0]]}
          layout="carousel"
          onClickImage={handleImageClick}
        />
      </section>

      <section className="mb-12 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Grid Layout with Custom Class
        </h2>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Applying a custom class to the gallery container.
        </p>
        <PhotoGallery
          images={sampleImages.slice(0, 3)}
          onClickImage={handleImageClick}
          className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md border border-brand"
        />
      </section>

      <section className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Empty Gallery</h2>
        <PhotoGallery images={[]} />
      </section>
    </div>
  );
}
