import Database from 'better-sqlite3';
const db = new Database('edu_control.db');

console.log('Fix grades v2 - Enhanced version');

const students = db.prepare('SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id = c.id').all();
console.log('Students with classes:', students.length);

students.forEach(s => {
  if (!s.group_id) {
    console.log(`Student ${s.name} has no group, skipping`);
  }
});

console.log('v2 complete');
