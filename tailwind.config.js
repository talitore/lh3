/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/frontend/**/*.js",
    "./app/frontend/**/*.jsx",
    "./app/frontend/**/*.ts",
    "./app/frontend/**/*.tsx",
    "./app/components/**/*.rb",
    "./app/components/**/*.html.erb",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
