'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants/app';

interface AdminToggleProps {
  className?: string;
}

export function AdminToggle({ className }: AdminToggleProps) {
  // Always start with false to ensure server/client consistency
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_MODE);
      if (saved) {
        setIsAdminMode(JSON.parse(saved) === true);
      }
    } catch {
      // Fallback to a safe default and wipe the bad value
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_MODE);
      setIsAdminMode(false);
    }
  }, []);

  // Save to localStorage whenever isAdminMode changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.ADMIN_MODE,
          JSON.stringify(isAdminMode),
        );
      } catch {
        // optional: add a toast or silently ignore
      }
    }
  }, [isAdminMode, isHydrated]);

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
