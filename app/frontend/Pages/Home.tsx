import React from "react";

interface HomeProps {
  message?: string;
}

const Home: React.FC<HomeProps> = ({ message }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to lh3</h1>
      <p>
        {message ||
          "Powered by Rails, Vite, Inertia, React, and Tailwind CSS (soon!)."}
      </p>
    </div>
  );
};

export default Home;
