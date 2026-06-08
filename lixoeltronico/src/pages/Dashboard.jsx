import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const resp = await api.get("/agendamentos/me");
        setMeusAgendamentos(resp.data || []);
      } catch (err) {
        setMeusAgendamentos([]);
      }
    }
    load();
  }, []);

  return (
    <div className="page-center">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Bem-vindo{user?.nome ? `, ${user.nome}` : ""}.</p>
        <p>Pontos: <strong>{user?.pontos ?? 0}</strong></p>
        <h4>Meus agendamentos</h4>
        <ul>
          {meusAgendamentos.map((a) => (
            <li key={a.id}>
              {a.dataHora} — {a.status}
            </li>
          ))}
        </ul>
        <button onClick={logout}>Sair</button>
      </div>
    </div>
  );
}
