import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

// Import global styles
import "../styles/application.css";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("../Pages/**/*.tsx", { eager: true });
    return pages[`../Pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    // The delay after which the progress bar will appear
    // during navigation, in milliseconds.
    delay: 250,

    // The color of the progress bar.
    color: "#29d",

    // Whether to include the default NProgress styles.
    includeCSS: true,

    // Whether the NProgress spinner will be shown.
    showSpinner: false,
  },
});
