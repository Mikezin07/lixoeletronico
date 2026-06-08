import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../services/auth";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      if (!email || !senha) return setError("Preencha email e senha.");
      setLoading(true);
      try {
        const data = await loginRequest(email, senha);
        login(data);
        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Erro ao autenticar.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!nome || !email || !senha) return setError("Preencha todos os campos.");
      setLoading(true);
      try {
        const data = await registerRequest(nome, email, senha);
        login({ token: "mock-new-" + Date.now(), user: data });
        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Erro ao registrar.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="page-center">
      <form className="card" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Entrar" : "Registrar"}</h2>
        {mode === "register" && (
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
        )}
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <label>
          Senha
          <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : mode === "login" ? "Entrar" : "Registrar"}
        </button>
        <div style={{ marginTop: 8, textAlign: "center" }}>
          {mode === "login" ? (
            <small>
              Não tem conta? <a onClick={() => setMode("register")}>Registrar</a>
            </small>
          ) : (
            <small>
              Já tem conta? <a onClick={() => setMode("login")}>Entrar</a>
            </small>
          )}
        </div>
      </form>
    </div>
  );
}
