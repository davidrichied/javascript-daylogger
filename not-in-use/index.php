<!doctype html>

<html lang="en">
    <link rel="stylesheet" href="style.css">

<?php

function is_david_logged_in() {
    $connection = mysqli_connect("localhost","wp","wp","wpscript") or die("Error " . mysqli_error($connection));

    $sql = "SELECT * FROM users_table";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

    $emparray = array();
    while($thing = mysqli_fetch_assoc($result)) {
        $emparray[] = $thing;
    };
    if ($emparray[0]["logged_in"] == true) {
        return true;
    } else {
        return false;
    }
}
//If David is not logged in, die.
if(!is_david_logged_in()) { ?>
    <form action="login.php" method="POST" id="login-form">
        <input id="input-password" name="password"  type="password" placeholder="password">
        <button type="submit">Submit</button>
    </form>
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script>

    let login_form = $("#login-form");
    
    var ajaxLogin = function(e) {
      console.log(e.target.parentNode);
      
      var inputPassword = login_form.find("#input-password").val();
      // Create our XMLHttpRequest object
      var hr = new XMLHttpRequest();
      // Create some variables we need to send to our PHP file
      var url = "login.php";
      var taskData = 
            "password="+inputPassword;

      hr.open("POST", url, true);
      // Set content type header information for sending url encoded variables in the request
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // Access the onreadystatechange event for the XMLHttpRequest object
      hr.onreadystatechange = function() {
        if(hr.readyState == 4 && hr.status == 200) {
          var return_data = hr.responseText;
          //check to see if it is valid JSON and run JSON.parse if it is
          console.log(return_data);
          inputPassword.value = "";
          location.reload();
            //Run appendElement and udpate the page with the data retrieved from PHP.
        }
      }
      // Send the taskData to PHP now... and wait for response
      hr.send(taskData); // Actually execute the request
    };
    login_form.submit(function(e) {
        e.preventDefault();
        ajaxLogin(e);
    })
    </script>
<?php } else { ?>


<div class="container" id="toDoListModule">

            
   <p><!-- This is the ADD ITEM part of the program-->
        <label for="new-task">Add Entry</label>
        <input id="entry-date" type="date" value="<?php echo date('Y-m-d'); ?>">
        <textarea id="new-task" type="text" placeholder="summary"></textarea>
        <textarea class="entry-textarea" id="entry-text" placeholder="entry"></textarea>
        
        <button class="addbutton">Add</button>
    </p>
    <p>
        <label for="select-date">Select Entry by Date</label>
        <input id="select-date" type="text" >
        
        <button class="select-button">Select</button>
    </p>

    <h3><span id="todoHTML"></span></h3><!--This is the part where the added/unticked todo items go -->
    <ul id="incomplete-tasks">
        
    </ul>

    <h3><span id="completedHTML"></span></h3><!-- This is where the ticked items go-->
    <ul id="completed-tasks">
        
    </ul>  
    <form id="logout-form" action="login.php" method="POST">
        <button type="submit" name="logout">Logout</button>
    </form>   
</div>
  
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script type="text/javascript" src="todolist.js"></script>
    <script>

    let logout_form = $("#logout-form");
    
    var ajaxLogout = function(e) {
      console.log(e.target.parentNode);
      var hr = new XMLHttpRequest();
      // Create some variables we need to send to our PHP file
      var url = "login.php";
      var taskData = 
            "logout='true'";

      hr.open("POST", url, true);
      // Set content type header information for sending url encoded variables in the request
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // Access the onreadystatechange event for the XMLHttpRequest object
      hr.onreadystatechange = function() {
        if(hr.readyState == 4 && hr.status == 200) {
          var return_data = hr.responseText;
          //check to see if it is valid JSON and run JSON.parse if it is
          console.log(return_data);
          location.reload();
          // location.reload();
            //Run appendElement and udpate the page with the data retrieved from PHP.
        }
      }
      // Send the taskData to PHP now... and wait for response
      hr.send(taskData); // Actually execute the request
    };
    logout_form.submit(function(e) {
        e.preventDefault();
        ajaxLogout(e);
    })
    </script>
<?php } ?>

    </html>
