<?php
// Connection variables
$servername = "localhost";
$username = "root";
$password = "@Rayyan786";
$dbname = "todolist_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Clear the existing tasks
$conn->query("DELETE FROM tasks");

// Get the tasks from the request
$tasks = json_decode(file_get_contents('php://input'), true);

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO tasks (completed, name, date, description) VALUES (?, ?, ?, ?)");

// Assuming tasks is an array of tasks
foreach ($tasks as $task) {
    $stmt->bind_param("isss", $task['completed'], $task['name'], $task['date'], $task['description']);
    $stmt->execute();
}

echo "New records created successfully";

$stmt->close();
$conn->close();
?>
