import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { seedData } from "./data/seed";

// Seed localStorage with demo data on first load
seedData();

const root = createRoot(document.getElementById("root"));
root.render(<App />);
