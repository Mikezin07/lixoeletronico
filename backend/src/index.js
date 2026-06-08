require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const pontosRoutes = require("./routes/pontos");
const agRoutes = require("./routes/agendamentos");
const rankingRoute = require("./routes/ranking");
const { readData, writeData, nextId } = require("./utils/dataStore");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// seed admin user if none exists
(function seedAdmin() {
	const users = readData("users");
	if (!users.find((u) => u.role === "ADMIN")) {
		const id = nextId(users);
		const hash = bcrypt.hashSync("admin123", 10);
		const admin = { id, nome: "Admin", email: "admin@local", senha_hash: hash, role: "ADMIN", pontos: 0 };
		users.push(admin);
		writeData("users", users);
		console.log("Admin user seeded: admin@local / admin123");
	}
})();

app.use("/auth", authRoutes);
app.use("/pontos", pontosRoutes);
app.use("/agendamentos", agRoutes);
app.use("/ranking", rankingRoute);

// health
app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
