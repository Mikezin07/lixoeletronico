const fs = require("fs");
const path = require("path");

function filePath(name) {
  return path.join(__dirname, "..", "..", "data", name + ".json");
}

function readData(name) {
  const p = filePath(name);
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}

function writeData(name, data) {
  const p = filePath(name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

function nextId(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id || 0)) + 1;
}

module.exports = { readData, writeData, nextId };
