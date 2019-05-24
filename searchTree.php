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

$searchWord = $conn->escape_string($_GET['query']);

function columnsTable($Search, $Table){
	
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
	
	
    $srchSQLstr = "SELECT * FROM $Table WHERE ";
    $tableFields = Array();

    $colSQL = $conn->prepare("SHOW COLUMNS FROM $Table");
    $colSQL->execute();
	$result = $colSQL->get_result();
	if($result->num_rows === 0) exit('No rows');
    while ($result_colSQL = $result->fetch_assoc()){
            $tableFields[] = $result_colSQL[Field]." LIKE ('%".$Search."%')";
			
        }
	
    $srchSQLstr .= implode(" OR ", $tableFields);
	$srchSQLstr= $srchSQLstr . " LIMIT 5";
    return $srchSQLstr;
}

$return_arr = [];
$StatusArr = [];

if($stmt = $conn->prepare(columnsTable($searchWord,"tree"))) {
   $stmt->execute(); 
   $result = $stmt->get_result();
   $num_rows = $result->num_rows;
   if($num_rows > 0){
   while ($row = $result->fetch_assoc()) {

    $array = [
    "treeNumber" => $row["treeNumber"],
    "rank" => $row["rank"],
	"navn" => $row["navn"],
	"datePlanted" => strtotime($row["datePlant"]),
	"text" => $row["text"],
	"link" => $row["link"],
	"image" => $row["image"],
]; 
array_push($return_arr, $array);
}
$StatusArr = [
	"status" => "true",
    "results" => $return_arr,
];

 }else {
	$StatusArr = [
	"status" => "false",
    "results" => $return_arr,
]; 
}
echo json_encode($StatusArr);
 }

   $stmt->close();
