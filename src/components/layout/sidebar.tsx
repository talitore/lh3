import Link from 'next/link';
import { Calendar, BarChart3, Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SIDEBAR_CONFIG } from '@/lib/constants/ui';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'calendar':
      return <Calendar className="h-4 w-4" />;
    case 'bar-chart':
      return <BarChart3 className="h-4 w-4" />;
    case 'settings':
      return <Settings className="h-4 w-4" />;
    default:
      return null;
  }
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 bg-gray-700 text-white border-gray-600">
        <SheetHeader>
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>

        <nav className="mt-6">
          <div className="space-y-6">
            {SIDEBAR_CONFIG.SECTIONS.map((section, index) => (
              <div key={section.id}>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                  {getIcon(section.icon)}
                  <span className="ml-2">{section.title}</span>
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
                    >
                      <Link href={item.href}>
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>
                {index < SIDEBAR_CONFIG.SECTIONS.length - 1 && (
                  <Separator className="mt-4 bg-gray-600" />
                )}
              </div>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
