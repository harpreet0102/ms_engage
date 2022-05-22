import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Router, BrowserRouter } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <h1 className="app-body">Welcome to Micromsoft</h1>

      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
