<!doctype html>

<html lang="en">

<link rel="stylesheet" href="css/style.css">
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
  
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/moment/moment.js"></script>
<script type="text/javascript" src="js/todolist.js"></script>

</html>
