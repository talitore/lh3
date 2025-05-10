'use client'; // For useState

import Input from '@/components/ui/input';
import { useState } from 'react';

// Placeholder Icons for demo
const SearchIcon = () => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);
const AtSymbolIcon = () => (
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
      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
    />
  </svg>
);

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
            <div>
              <label
                htmlFor="text-basic"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Text Input
              </label>
              <Input
                id="text-basic"
                type="text"
                placeholder="Enter some text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current value: {textValue}
              </p>
            </div>
            <div>
              <label
                htmlFor="email-basic"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Input
              </label>
              <Input
                id="email-basic"
                type="email"
                placeholder="name@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password-basic"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password Input
              </label>
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
            <div>
              <label
                htmlFor="search-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search (Icon Left)
              </label>
              <Input
                id="search-input"
                type="search"
                placeholder="Search..."
                iconLeft={<SearchIcon />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="username-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username (Icon Right)
              </label>
              <Input
                id="username-input"
                type="text"
                placeholder="yourusername"
                iconRight={<AtSymbolIcon />}
              />
            </div>
          </div>
        </section>

        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Disabled Input</h2>
          <div>
            <label
              htmlFor="disabled-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Disabled Text Input
            </label>
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
          <div>
            <label
              htmlFor="custom-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Custom Styled Input
            </label>
            <Input
              id="custom-input"
              type="text"
              placeholder="Focus me!"
              className="border-brand focus:ring-brand-dark focus:border-brand-dark shadow-lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
