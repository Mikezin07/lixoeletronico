const express = require("express");
const { readData, writeData, nextId } = require("../utils/dataStore");
const auth = require("../middlewares/auth");
const router = express.Router();

// list pontos
router.get("/", (req, res) => {
  const pontos = readData("pontos");
  res.json(pontos);
});

// get ponto by id
router.get("/:id", (req, res) => {
  const pontos = readData("pontos");
  const p = pontos.find((x) => String(x.id) === String(req.params.id));
  if (!p) return res.status(404).json({ message: "Ponto não encontrado" });
  res.json(p);
});

// create ponto (protected - admin only)
router.post("/", auth, (req, res) => {
  const user = req.user;
  if (user.role !== "ADMIN") return res.status(403).json({ message: "Acesso negado" });
  const { empresa, endereco, horario_inicio, horario_fim, lat, lng } = req.body;
  const pontos = readData("pontos");
  const id = nextId(pontos);
  const p = { id, empresa, endereco, horario_inicio, horario_fim, lat, lng };
  pontos.push(p);
  writeData("pontos", pontos);
  res.status(201).json(p);
});

module.exports = router;
