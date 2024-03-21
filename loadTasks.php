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

$sql = "SELECT id, completed, name, date, description FROM tasks";
$result = $conn->query($sql);

$tasks = [];

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $row['completed'] = $row['completed'] == 1;
        $tasks[] = $row;
    }
    echo json_encode($tasks);
} else {
    echo "0 results";
}
$conn->close();
?>
