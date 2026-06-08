const express = require("express");
const { readData, writeData, nextId } = require("../utils/dataStore");
const auth = require("../middlewares/auth");
const router = express.Router();

// create agendamento (authenticated)
router.post("/", auth, (req, res) => {
  const { pontoId, dataHora, observacao } = req.body;
  if (!pontoId || !dataHora) return res.status(400).json({ message: "Campos obrigatórios" });
  const ags = readData("agendamentos");
  const id = nextId(ags);
  const ag = { id, usuarioId: req.user.id, pontoId, dataHora, observacao, status: "AGENDADO", criado_em: new Date().toISOString() };
  ags.push(ag);
  writeData("agendamentos", ags);
  res.status(201).json(ag);
});

// list agendamentos do usuário (authenticated)
router.get("/me", auth, (req, res) => {
  const ags = readData("agendamentos");
  const mine = ags.filter((a) => a.usuarioId === req.user.id);
  res.json(mine);
});

// coletor confirma recebimento (protected)
router.post("/:id/confirmar", auth, (req, res) => {
  const { peso, categoria } = req.body;
  const ags = readData("agendamentos");
  const idx = ags.findIndex((a) => String(a.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Agendamento não encontrado" });
  const ag = ags[idx];
  ag.status = "CONCLUIDO";
  ag.peso = peso || 0;
  ag.categoria = categoria || null;
  ag.data_confirmacao = new Date().toISOString();
  writeData("agendamentos", ags);

  // atribuir pontos simples: 10 pontos por kg
  const users = readData("users");
  const uidx = users.findIndex((u) => u.id === ag.usuarioId);
  if (uidx !== -1) {
    const gained = Math.round((ag.peso || 0) * 10);
    users[uidx].pontos = (users[uidx].pontos || 0) + gained;
    writeData("users", users);
  }

  res.json(ag);
});

module.exports = router;
