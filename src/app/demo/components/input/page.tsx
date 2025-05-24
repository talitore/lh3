'use client'; // For useState

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Search, AtSign } from 'lucide-react';

export default function InputDemoPage() {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Input Component Demo</h1>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Inputs</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-basic">Text Input</Label>
              <Input
                id="text-basic"
                type="text"
                placeholder="Enter some text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Current value: {textValue}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-basic">Email Input</Label>
              <Input
                id="email-basic"
                type="email"
                placeholder="name@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-basic">Password Input</Label>
              <Input
                id="password-basic"
                type="password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Inputs with Icons</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-input">Search Input</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  type="search"
                  placeholder="Search..."
                  className="pl-10"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username-input">Username Input</Label>
              <div className="relative">
                <Input
                  id="username-input"
                  type="text"
                  placeholder="yourusername"
                  className="pr-10"
                />
                <AtSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Disabled Input</h2>
          <div className="space-y-2">
            <Label htmlFor="disabled-input">Disabled Text Input</Label>
            <Input
              id="disabled-input"
              type="text"
              placeholder="Cannot be edited"
              disabled
              value="Some disabled content"
            />
          </div>
        </section>

        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Input with Custom Styling
          </h2>
          <div className="space-y-2">
            <Label htmlFor="custom-input">Custom Styled Input</Label>
            <Input
              id="custom-input"
              type="text"
              placeholder="Focus me!"
              className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
