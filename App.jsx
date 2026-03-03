import React, { useState } from "react";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("admin");

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard userType={userType} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
