'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants/app';

interface AdminToggleProps {
  className?: string;
}

export function AdminToggle({ className }: AdminToggleProps) {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_MODE);
        return saved ? JSON.parse(saved) === true : false;
      } catch {
        // Fallback to a safe default and wipe the bad value
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_MODE);
        return false;
      }
    }
    return false;
  });

  // Save to localStorage whenever isAdminMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.ADMIN_MODE,
          JSON.stringify(isAdminMode),
        );
      } catch {
        // optional: add a toast or silently ignore
      }
    }
  }, [isAdminMode]);

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
