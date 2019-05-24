<?php

header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "theTreeLot";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$return_arr = array();

$sql = "SELECT * FROM trees";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    $row_array['numba'] = $row['treeNumber'];
    $row_array['lat'] = $row['lat'];
    $row_array['lng'] = $row['lng'];

    array_push($return_arr,$row_array);
} } else {
    echo "0 results";
}
$conn->close();

echo json_encode($return_arr);