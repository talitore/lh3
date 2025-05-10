import Button from '@/components/ui/button';

// Placeholder Icon for demo
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

export default function ButtonDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Button Component Demo</h1>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium (Default)
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Button with Icon</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" icon={<PlusIcon />}>
            Add Item
          </Button>
          <Button variant="secondary" size="sm" icon={<PlusIcon />}>
            New
          </Button>
          <Button variant="outline" icon={<PlusIcon />}>
            Create
          </Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Disabled Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" disabled>
            Primary Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
          <Button variant="outline" icon={<PlusIcon />} disabled>
            Outline Disabled
          </Button>
          <Button variant="ghost" disabled>
            Ghost Disabled
          </Button>
          <Button variant="link" disabled>
            Link Disabled
          </Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Custom Styled Button</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">
            Custom Teal Button
          </Button>
        </div>
      </section>
    </div>
  );
}
