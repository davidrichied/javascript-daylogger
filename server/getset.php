<?php
require('config.php');
$entry_day = $_POST['entry_day'];
$connection = mysqli_connect("localhost",$db_username,$db_password,$db_name) or die("Error " . mysqli_error($connection));
// this sql statement gets the $entry_day from the JS file. $entry_day can be any number resembling a date, and the sql statement will find all of the entries with a date like the number provided.
$sql = "SELECT * FROM $table_name WHERE $date_column LIKE '%$entry_day%'";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

$emparray = array();
  	while($thing = mysqli_fetch_assoc($result))
  		{
      		$emparray[] = $thing;
  		};
echo json_encode($emparray);
return;