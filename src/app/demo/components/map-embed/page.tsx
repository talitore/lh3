import MapEmbed from '@/components/custom/map-embed';

export default function MapEmbedDemoPage() {
  const lawrenceKansasCoords =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99434.98025200026!2d-95.32807050703787!3d38.95920874279327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bf0ada3fa74955%3A0x5bf97cb9320a7027!2sLawrence%2C%20KS!5e0!3m2!1sen!2sus!4v1678886612345'; // Example URL

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">MapEmbed Component Demo</h1>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Map Embed</h2>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Default dimensions (100% width, 450px height).
        </p>
        <MapEmbed src={lawrenceKansasCoords} title="Lawrence, KS Location" />
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Map Embed with Custom Dimensions
        </h2>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Custom width (600px) and height (300px).
        </p>
        <MapEmbed
          src={lawrenceKansasCoords}
          title="Lawrence, KS - Custom Size"
          width="600px"
          height="300px"
        />
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Map Embed with Custom Class
        </h2>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Applying a custom border using Tailwind classes.
        </p>
        <MapEmbed
          src={lawrenceKansasCoords}
          title="Lawrence, KS - Custom Border"
          className="border-4 border-brand-dark rounded-xl"
        />
      </section>

      <p className="mt-8 text-xs text-gray-500">
        Note: The map functionality (zoom, pan, markers) is provided by the
        embedded service (e.g., Google Maps). The `MapEmbed` component is a
        simple wrapper for the iframe.
      </p>
    </div>
  );
}
