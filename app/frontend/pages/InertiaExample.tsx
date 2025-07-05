import React from "react";
import { Link } from "@inertiajs/react";
import DefaultLayout from "../layouts/DefaultLayout";
import { editPasswordPath } from "../routes";

interface InertiaExampleProps {
  name?: string;
}

export default function InertiaExample({
  name = "World",
}: InertiaExampleProps) {
  return (
    <DefaultLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hello, {name}!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Welcome to your Rails + Inertia.js + React application!
            </p>

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <img src="/app/assets/images/rails.svg" alt="Rails" />
                <span className="text-2xl">+</span>
                <img src="/app/assets/images/inertia.svg" alt="Inertia.js" />
                <span className="text-2xl">+</span>
                <img src="/app/assets/images/react.svg" alt="React" />
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <div className="space-y-2">
                  <Link
                    href="/sessions"
                    className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Manage Sessions
                  </Link>
                  <Link
                    href={editPasswordPath()}
                    className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
