import "./App.css";
import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InitialPage } from "./pages/InitialPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialPage />}></Route>
        <Route path="/result" element={<ResultPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
