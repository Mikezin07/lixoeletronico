const express = require("express");
const { readData } = require("../utils/dataStore");
const router = express.Router();

// GET /ranking - retorna usuários ordenados por pontos desc
router.get("/", (req, res) => {
  const users = readData("users");
  const ranked = users
    .map((u) => ({ id: u.id, nome: u.nome, pontos: u.pontos || 0 }))
    .sort((a, b) => b.pontos - a.pontos);
  res.json(ranked);
});

module.exports = router;
