<?php
$text_column = 'logged_in';

$connection = mysqli_connect("localhost","wp","wp","wpscript") or die("Error " . mysqli_error($connection));

if (isset($_POST['password'])) {
	$sql = "SELECT password FROM users_table WHERE username='david'";
	$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

	$emparray = array();
    	while($thing = mysqli_fetch_assoc($result))
    		{
        		$emparray[] = $thing;
    		};
    var_dump($emparray[0]["password"]);
    if ($_POST['password'] !== $emparray[0]["password"]) {
    	var_dump("expression");
    	die();
    }
	// real_escape_string escapes quotes in tasktext; otherwise, the query would fail.
	$sqlAction = "UPDATE users_table SET logged_in=1 WHERE username='david'";
	$action = mysqli_query($connection, $sqlAction) or die("Error in Selecting " . mysqli_error($connection));
} else if (isset($_POST['logout'])) {
	$sqlAction = "UPDATE users_table SET logged_in=0 WHERE username='david'";
	$action = mysqli_query($connection, $sqlAction) or die("Error in Selecting " . mysqli_error($connection));
}
