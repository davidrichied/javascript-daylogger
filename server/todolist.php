<?php 
// the emparray is very important in this program.
// it creates a JSON string of the entire database and sends it to the JS file. The JS file parses it and uses it to modify the program.

require('config.php');

$post_status = 'task_firstopen';

if (isset($_POST['task_id'])) {
 $tasktext = $_POST['title'];
 $taskaction = $_POST['task_action'];
 $entrytext = $_POST['description'];
 $entrydate = $_POST['start'];
 $taskid = $_POST['task_id'];
} else {
	$firstopen = $_POST[$post_status];

	$connection = mysqli_connect("localhost",$db_username,$db_password,$db_name) or die("Error " . mysqli_error($connection));

	$sql = "SELECT * FROM $table_name ORDER BY $date_column DESC LIMIT 5";
	$result = mysqli_query($connection, $sql);

	if (empty($result)) {
		$create_query = mysqli_query($connection,"CREATE TABLE IF NOT EXISTS $table_name (
		        id INT NOT NULL AUTO_INCREMENT,
		        PRIMARY KEY(id),
		        $date_column    DATE NOT NULL,
		        $text_column   TEXT NOT NULL,
		        $description_column TEXT NOT NULL
		    )");
		echo 'Table was created';
		die();
	}
	$entries = array();
    while($entry = mysqli_fetch_assoc($result)) {
        $entries[] = $entry;
    };
	echo json_encode($entries);
	return;
}

if($taskaction == 'add_task') {
	$connection = mysqli_connect("localhost",$db_username,$db_password,$db_name) or die("Error " . mysqli_error($connection));
	// real_escape_string escapes quotes in tasktext; otherwise, the query would fail.
	$entrytext = $connection->real_escape_string($entrytext);
	$tasktext = $connection->real_escape_string($tasktext);
	$sqlAction = "insert into $table_name ($text_column, $description_column, $date_column) values ('$tasktext', '$entrytext', '$entrydate')";
	$action = mysqli_query($connection, $sqlAction) or die("Error in Selecting " . mysqli_error($connection));



	$sqlResult = "SELECT * FROM $table_name ORDER BY id DESC LIMIT 1";
	$result = mysqli_query($connection, $sqlResult) or die("Error in Selecting " . mysqli_error($connection));

	$entries = array();
  while ($entry = mysqli_fetch_assoc($result)) {
    $entries[] = $entry;
  };

 //  //This part only applies to the calendar which is why I've separated it. It updates the new entry with info for the cal.
 //  $new_entry_id = $entries[0]["id"];
	// $sqlActionCal = "update $table_name set allDay='true', color='#587ca3', url='false', category='General', repeat_type='no' where id=$new_entry_id";
	// $actionCal = mysqli_query($connection, $sqlActionCal) or die("Error in Selecting " . mysqli_error($connection));


	echo json_encode($entries);


} else if($taskaction == 'delete') {

	$connection = mysqli_connect("localhost",$db_username,$db_password,$db_name) or die("Error " . mysqli_error($connection));
	$sqlAction = "delete from $table_name where $id_column = ('$taskid')";
	$action = mysqli_query($connection, $sqlAction) or die("Error in Selecting " . mysqli_error($connection));

} else if($taskaction == 'update') {
	$connection = mysqli_connect("localhost",$db_username,$db_password,$db_name) or die("Error " . mysqli_error($connection));
	$entrytext = $connection->real_escape_string($entrytext);
	$tasktext = $connection->real_escape_string($tasktext);
	$sqlAction = "UPDATE $table_name SET $text_column='$tasktext', $description_column='$entrytext', $date_column='$entrydate' WHERE $id_column='$taskid'";
	$action = mysqli_query($connection, $sqlAction) or die("Error in Selecting " . mysqli_error($connection));

}



?>