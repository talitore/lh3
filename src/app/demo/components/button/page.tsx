import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ButtonDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Button Component Demo</h1>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default" size="sm">
            Small
          </Button>
          <Button variant="default">
            Default
          </Button>
          <Button variant="default" size="lg">
            Large
          </Button>
          <Button variant="default" size="icon">
            <Plus />
          </Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Button with Icon</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">
            <Plus />
            Add Item
          </Button>
          <Button variant="secondary" size="sm">
            <Plus />
            New
          </Button>
          <Button variant="outline">
            <Plus />
            Create
          </Button>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Disabled Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default" disabled>
            Default Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
          <Button variant="outline" disabled>
            <Plus />
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
