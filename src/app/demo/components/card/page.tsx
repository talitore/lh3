import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CardDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Card Component Demo</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Card</h2>
          <Card className="mb-4">
            <CardContent>
              <p>This is a basic card with some content. It only has children.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Card with Header</h2>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is a card description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a title and some content.</p>
              <p>More content can go here, like lists or other elements.</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 p-4 border rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Card with Footer
          </h2>
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle>Custom Styled Card</CardTitle>
              <CardDescription>A card with custom styling and footer</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This card has custom background and text colors applied via the
                className prop.
              </p>
              <p>The border color is also customized.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </section>

        <section className="mb-8 p-4 border rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Multiple Cards in a Layout
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Content for card 1.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Content for card 2. This one might have a bit more text to see
                  how it wraps.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p>Card 3 with no title, just children.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
