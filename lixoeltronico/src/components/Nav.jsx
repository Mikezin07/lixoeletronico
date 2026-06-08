import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={{ padding: 8 }}>
      <Link to="/home" style={{ marginRight: 8 }}>
        Home
      </Link>
      {user ? (
        <>
          <Link to="/dashboard" style={{ marginRight: 8 }}>
            Dashboard
          </Link>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <Link to="/login">Entrar</Link>
      )}
    </nav>
  );
}
