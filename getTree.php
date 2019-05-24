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
mysqli_set_charset($conn,"utf8");

$searchNumber = $_GET['tree'];

if($stmt = $conn->prepare("SELECT * FROM tree WHERE treeNumber = ?")) {

   $stmt->bind_param("s", $searchNumber); 
   $stmt->execute(); 
   $result = $stmt->get_result();

   while ($row = $result->fetch_assoc()) {

    $return_arr = [
    "treeNumber" => $row["treeNumber"],
    "rank" => $row["rank"],
	"navn" => $row["navn"],
	"datePlanted" => strtotime($row["datePlant"]),
	"text" => $row["text"],
	"link" => $row["link"],
	"image" => $row["image"],
]; 
} }

   $stmt->close();
echo json_encode($return_arr);