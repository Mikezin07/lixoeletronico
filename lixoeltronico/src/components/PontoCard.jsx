import React from "react";

export default function PontoCard({ ponto }) {
  return (
    <div className="ponto-card">
      <h4>{ponto.empresa}</h4>
      <p>{ponto.endereco}</p>
      <p>
        {ponto.horario_inicio} - {ponto.horario_fim}
      </p>
    </div>
  );
}
