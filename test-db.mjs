import Database from 'better-sqlite3';
const db = new Database('edu_control.db');

const students = db.prepare('SELECT * FROM students').all();
console.log('Students:', students);

const classes = db.prepare('SELECT * FROM classes').all();
console.log('Classes:', classes);

const users = db.prepare('SELECT * FROM users').all();
console.log('Users:', users);
