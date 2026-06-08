import React from "react";
import useFetch from "../hooks/useFetch";
import PontoCard from "../components/PontoCard";

export default function Home() {
  const { data: pontos, loading } = useFetch("/pontos");

  return (
    <div className="page-center">
      <div className="card">
        <h2>Pontos de Coleta</h2>
        {loading && <p>Carregando...</p>}
        {!loading && (!pontos || pontos.length === 0) && <p>Nenhum ponto cadastrado.</p>}
        <ul>
          {pontos && pontos.map((p) => (
            <li key={p.id}>
              <PontoCard ponto={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
