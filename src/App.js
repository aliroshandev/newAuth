import React from "react";
import Main from "base/components/Main/Main";
import "base/Assets/font/fonts.css";
import "base/Assets/css/global.scss";
import "base/Assets/css/options.css";
import "./App.scss";
import CustomSpinner from "base/components/CustomSpinner/CustomSpinner";

export default function App() {
  return (
    <React.Suspense fallback={<CustomSpinner />}>
      <Main />
    </React.Suspense>
  );
}
