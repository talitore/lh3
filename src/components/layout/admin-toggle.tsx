'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AdminToggleProps {
  className?: string;
}

export function AdminToggle({ className }: AdminToggleProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="admin-mode"
        checked={isAdminMode}
        onCheckedChange={setIsAdminMode}
      />
      <Label
        htmlFor="admin-mode"
        className="text-xs text-white cursor-pointer"
      >
        Admin Mode
      </Label>
    </div>
  );
}
