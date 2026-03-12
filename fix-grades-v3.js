import Database from 'better-sqlite3';
const db = new Database('edu_control.db');

console.log('Fix grades v3 - With transaction');

const fixGrades = db.transaction(() => {
  const students = db.prepare('SELECT * FROM students').all();
  
  students.forEach(student => {
    if (student.student_id && !student.student_id.startsWith('S')) {
      const newId = 'S' + student.student_id.padStart(3, '0');
      db.prepare('UPDATE students SET student_id = ? WHERE id = ?').run(newId, student.id);
      console.log(`Updated ${student.name}: ${student.student_id} -> ${newId}`);
    }
  });
});

fixGrades();
console.log('v3 complete');
