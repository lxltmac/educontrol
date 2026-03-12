import Database from 'better-sqlite3';
const db = new Database('edu_control.db');

console.log('Fix grades v4 - Final version with validation');

function fixGrades() {
  const students = db.prepare('SELECT * FROM students').all();
  console.log(`Processing ${students.length} students`);
  
  let fixed = 0;
  students.forEach(student => {
    let needsUpdate = false;
    let newId = student.student_id;
    
    if (!newId) {
      newId = 'S' + String(student.id).padStart(3, '0');
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      db.prepare('UPDATE students SET student_id = ? WHERE id = ?').run(newId, student.id);
      fixed++;
      console.log(`Fixed: ${student.name} -> ${newId}`);
    }
  });
  
  console.log(`Fixed ${fixed} students`);
  return fixed;
}

fixGrades();
