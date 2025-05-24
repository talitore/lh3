import Link from 'next/link';

const components = [
  { name: 'Card', path: '/card' },
  { name: 'Badge', path: '/badge' },
  { name: 'Button', path: '/button' },
  { name: 'Input', path: '/input' },
  { name: 'MapEmbed', path: '/map-embed' },
  { name: 'PhotoGallery', path: '/photo-gallery' },
  { name: 'AddressAutocomplete', path: '/address-autocomplete' },
  { name: 'MapPicker', path: '/map-picker' },
  { name: 'LocationPicker', path: '/location-picker' },
];

export default function ComponentsDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">UI Component Sandbox</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        This page showcases the reusable UI components developed for the
        application. Click on a component name to see it in action with various
        props and states.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <Link key={component.name} href={`/components${component.path}`}>
            <div className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <h2 className="text-xl font-semibold text-brand dark:text-brand-light mb-2">
                {component.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View examples of the {component.name} component.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
