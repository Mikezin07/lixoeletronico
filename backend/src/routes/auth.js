const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readData, writeData, nextId } = require("../utils/dataStore");
const router = express.Router();
const SECRET = process.env.JWT_SECRET || "devsecret";

// Register
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ message: "Campos obrigatórios" });

  const users = readData("users");
  if (users.find((u) => u.email === email)) return res.status(400).json({ message: "Email já cadastrado" });

  const hash = await bcrypt.hash(senha, 10);
  const id = nextId(users);
  const user = { id, nome, email, senha_hash: hash, role: "CIDADAO", pontos: 0 };
  users.push(user);
  writeData("users", users);
  const safe = { id: user.id, nome: user.nome, email: user.email, role: user.role };
  res.status(201).json(safe);
});

// Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ message: "Campos obrigatórios" });
  const users = readData("users");
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Credenciais inválidas" });
  const ok = await bcrypt.compare(senha, user.senha_hash);
  if (!ok) return res.status(401).json({ message: "Credenciais inválidas" });
  const token = jwt.sign({ id: user.id, nome: user.nome, role: user.role }, SECRET, { expiresIn: "8h" });
  res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
});

module.exports = router;
