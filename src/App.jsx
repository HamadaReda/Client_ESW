import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// import PrimeReact
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { ratingStyle } from "./layout/ratingStyle";
import { galleria } from "./layout/galleria";

function App() {
  const rating = {
    rating: ratingStyle,
  };
  const galleriastyle = {
    galleria: galleria,
  };
  return (
    <div className="App">
      {/* Defined PrimeReact */}
      <PrimeReactProvider
        value={{ unstyled: true, pt: { ...Tailwind, ...rating, ...galleriastyle } }}
      >
        <Routes>
          {/* Routes for users */}
          <Route path="/*" element={<UserRoutes />} />
          {/* Routes for admins */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
