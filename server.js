const express = require('express');
const app = express();
const PORT = 4000;
const cors=require('cors')
app.use(express.json());
app.use(cors())

const students = [
    {
        id: 1,
        name: "Alice",
        branch: "CSE"
    },
    {
        id: 2,
        name: "Bob",
        branch: "ECE"
    },
    {
        id: 3,
        name: "Charlie",
        branch: "IT"
    }
];

app.get('/', (req, res) => {
    res.send("Welcome To Student API");
});

app.get('/students', (req, res) => {
    res.json(students);
});

app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).send("Student not found");
    }
    res.json(student);
});

app.post('/students', (req, res) => {
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        branch: req.body.branch
    };
    console.log("New Student --->", newStudent);
    students.push(newStudent);
    res.status(200).json({ message: "Student data added successfully", data: newStudent });
});

app.put('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
        return res.status(400).send("Student not found");
    }
    student.name = req.body.name;
    student.branch = req.body.branch;
    res.status(200).json(student);
});

app.delete('/students/:id', (req, res) => {
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    if (studentIndex === -1) {
        return res.status(400).json({ message: "Student not found" });
    }
    students.splice(studentIndex, 1);
    res.status(200).json({ message: "Student data deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
