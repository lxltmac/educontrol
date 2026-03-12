import Database from 'better-sqlite3';
const db = new Database('edu_control.db');

console.log('Fixing grades...');

const students = db.prepare('SELECT * FROM students').all();
console.log('Found students:', students.length);

students.forEach(student => {
  console.log(`Updating student ${student.name} (${student.student_id})`);
});

console.log('Done!');
