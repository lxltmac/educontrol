import express from "express";
import Database from "better-sqlite3";
import path from "path";
import multer from "multer";
import * as fs from "fs";
import { fileURLToPath } from "url";
import * as crypto from "crypto";
import * as XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const sanitizedName = originalName
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_');
    cb(null, uniqueSuffix + "-" + sanitizedName);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const db = new Database("edu_control.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'teacher',
    name TEXT NOT NULL,
    avatar TEXT,
    student_id INTEGER
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT,
    student_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    student_id TEXT UNIQUE,
    class_id INTEGER,
    group_id INTEGER
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER
  );

  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT,
    file_size INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploader_name TEXT,
    uploader_username TEXT,
    folder_id INTEGER
  );

  CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    route TEXT,
    icon TEXT,
    parent_id INTEGER,
    order_index INTEGER DEFAULT 0,
    enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const roleCount = (db.prepare("SELECT COUNT(*) as count FROM roles").get() as any).count;
if (roleCount === 0) {
  db.prepare("INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)").run(
    'admin', '系统管理员', JSON.stringify(['all']));
  db.prepare("INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)").run(
    'teacher', '教师', JSON.stringify(['view', 'edit']));
  db.prepare("INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)").run(
    'student', '学生', JSON.stringify(['view']));
}

db.exec(`INSERT OR IGNORE INTO users (username, password, role, name) VALUES ('admin', 'admin123', 'admin', '管理员')`);

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use("/uploads", express.static(uploadDir));

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) res.json({ success: true, user });
    else res.status(401).json({ success: false, message: "错误" });
  });

  app.get("/api/classes", (req, res) => {
    res.json(db.prepare("SELECT * FROM classes").all());
  });

  app.get("/api/users", (req, res) => {
    res.json(db.prepare("SELECT id, username, role, name, avatar FROM users").all());
  });

  app.get("/api/files", (req, res) => {
    res.json(db.prepare("SELECT * FROM files ORDER BY uploaded_at DESC").all());
  });

  app.post("/api/files", upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "无文件" });
    const { studentId, fileType } = req.body;
    const name = Buffer.from(file.originalname, 'latin1').toString('utf8');
    db.prepare("INSERT INTO files (student_id, name, file_type, file_url, file_size) VALUES (?, ?, ?, ?, ?)")
      .run(studentId, name, fileType, `/uploads/${file.filename}`, file.size);
    res.json({ success: true });
  });

  app.use(express.static(path.join(__dirname, "dist"), { index: ['index.html'] }));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
