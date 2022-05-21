import "./App.css";
import React, { useState } from "react";

import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <h1 className="app-body">Welcome to Micromsoft</h1>
      {showLogin ? (
        <LoginForm setShowLogin={setShowLogin} />
      ) : (
        <SignUpForm setShowLogin={setShowLogin} />
      )}
    </>
  );
}

export default App;
