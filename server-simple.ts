import express from "express";
import Database from "better-sqlite3";
import path from "path";
import multer from "multer";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("edu_control.db");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "用户名或密码错误" });
  }
});

app.get("/api/classes", (req, res) => {
  const classes = db.prepare("SELECT * FROM classes").all();
  res.json(classes);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
