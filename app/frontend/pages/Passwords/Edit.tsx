import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { passwordPath } from '../../routes';

interface PasswordEditErrors {
  password_challenge?: string[];
  password?: string[];
  password_confirmation?: string[];
}

interface PasswordEditProps {
  errors?: PasswordEditErrors;
}

export default function Edit({ errors }: PasswordEditProps) {
  const { data, setData, patch, processing } = useForm({
    password_challenge: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(passwordPath());
  };

  return (
    <DefaultLayout>
      <Head title="Change Password" />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Change your password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password_challenge"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <input
                id="password_challenge"
                name="password_challenge"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={data.password_challenge}
                onChange={(e) => setData('password_challenge', e.target.value)}
              />
              {errors?.password_challenge && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password_challenge[0]}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
              {errors?.password && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password[0]}
                </div>
              )}
              <div className="mt-1 text-sm text-gray-600">
                12 characters minimum.
              </div>
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData('password_confirmation', e.target.value)
                }
              />
              {errors?.password_confirmation && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password_confirmation[0]}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}
