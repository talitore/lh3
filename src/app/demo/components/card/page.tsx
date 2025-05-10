import Card from '@/components/ui/card';

export default function CardDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Card Component Demo</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Card</h2>
          <Card className="mb-4">
            <p>This is a basic card with some content. It only has children.</p>
          </Card>
        </section>

        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Card with Title</h2>
          <Card title="Card Title" className="mb-4">
            <p>This card has a title and some content.</p>
            <p>More content can go here, like lists or other elements.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </Card>
        </section>

        <section className="mb-8 p-4 border rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Card with Custom Styling
          </h2>
          <Card
            title="Custom Styled Card"
            className="bg-brand-light text-brand-dark border-brand-dark"
          >
            <p>
              This card has custom background and text colors applied via the
              className prop.
            </p>
            <p>The border color is also customized.</p>
          </Card>
        </section>

        <section className="mb-8 p-4 border rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Multiple Cards in a Layout
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Card 1">
              <p>Content for card 1.</p>
            </Card>
            <Card title="Card 2">
              <p>
                Content for card 2. This one might have a bit more text to see
                how it wraps.
              </p>
            </Card>
            <Card>
              <p>Card 3 with no title, just children.</p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
