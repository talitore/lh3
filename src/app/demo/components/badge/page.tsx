import Badge from '@/components/ui/badge';

export default function BadgeDemoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Badge Component Demo</h1>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Badge Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Badges with Custom Styling
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="success" className="px-4 py-1 text-base">
            Large Success
          </Badge>
          <Badge variant="info" className="rounded-sm">
            Square Info
          </Badge>
          <Badge className="bg-purple-500 text-white">Custom Purple</Badge>
        </div>
      </section>

      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Badges in Text</h2>
        <p className="text-lg">
          You can use badges to highlight certain keywords or statuses like
          <Badge variant="info" className="mx-1">
            NEW
          </Badge>
          or indicate a
          <Badge variant="danger" className="mx-1">
            CRITICAL
          </Badge>
          issue.
        </p>
      </section>
    </div>
  );
}
