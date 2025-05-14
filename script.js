const apiUrl = 'http://localhost:4000/students';

// Load all students on page load
window.onload = () => {
    fetchStudents();
};

// Fetch and display students
function fetchStudents() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById('showData');
            tableBody.innerHTML = '';
            data.forEach(student => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.branch}</td>
                        <td>
                            <button class="btn btn-sm btn-edit me-2" onclick="openEditModal(${student.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-delete" onclick="deleteStudent(${student.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}

// Open modal and fill form with existing student data
function openEditModal(id) {
    fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(student => {
            document.getElementById('modal-id').value = student.id;
            document.getElementById('modal-name').value = student.name;
            document.getElementById('modal-email').value = student.email;
            document.getElementById('modal-branch').value = student.branch;

            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        })
        .catch(error => console.error('Error loading student:', error));
}

// Handle the edit form submission
function handleEdit() {
    const id = document.getElementById('modal-id').value;
    const updatedStudent = {
        name: document.getElementById('modal-name').value,
        email: document.getElementById('modal-email').value,
        branch: document.getElementById('modal-branch').value
    };

    // Validation check
    if (!updatedStudent.name || !updatedStudent.email || !updatedStudent.branch) {
        alert("All fields are required!");
        return;
    }

    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent)
    })
        .then(res => res.json())
        .then(() => {
            fetchStudents(); // Refresh table
            bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
        })
        .catch(error => console.error('Error updating student:', error));
}

// Handle adding a new student
function handleAdd() {
    const name = document.getElementById('add-name').value;
    const email = document.getElementById('add-email').value;
    const branch = document.getElementById('add-branch').value;

    // Validation check
    if (!name || !email || !branch) {
        alert("All fields are required!");
        return;
    }

    const newStudent = { name, email, branch };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent)
    })
    .then(res => res.json())
    .then(() => {
        fetchStudents(); // Refresh table
        bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();

        // Clear form
        document.getElementById('add-name').value = '';
        document.getElementById('add-email').value = '';
        document.getElementById('add-branch').value = '';
    })
    .catch(error => console.error('Error adding student:', error));
}

// Handle deleting a student
function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(() => {
            fetchStudents(); // Refresh table
        })
        .catch(error => console.error('Error deleting student:', error));
}