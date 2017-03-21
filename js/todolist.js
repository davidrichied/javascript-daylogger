
var myModule = (function() {
  var tasks = [];

  var toDoList = {
    tasksCompleteNumber: 0,
    tasksIncompleteNumber: 0,
    modVariables: {},
    // this function is run at the bottom and starts the program
    init: function(){
      helperFunctions.isRunning("init");
      this.loadVariables();
      this.cacheDom();
      this.render();
    },
    loadVariables: function() {
      toDoList.modVariables['site'] = window.location.protocol + "//" + window.location.host + "/";
      toDoList.modVariables['server_folder_path'] = 'todolist/todolist/server/';
      toDoList.modVariables['server_folder_url'] = toDoList.modVariables.site + toDoList.modVariables.server_folder_path;
    },
    // get any necessary elements to be used later
    cacheDom: function(){
      helperFunctions.isRunning("cacheDom");
      this.$el = $("#toDoListModule");
      this.$addButton = this.$el.find('.addbutton');
      this.$selectButton = this.$el.find('.select-button');
      this.$selectDateInput = this.$el.find('#select-date');
      this.$summaryInput = this.$el.find('#new-task');
      this.$entryText = this.$el.find('#entry-text');
      this.$entryDate = this.$el.find('#entry-date');
      this.$completedTasksHolder = this.$el.find('#completed-tasks');
      this.$todoHTML = this.$el.find("#todoHTML");
      this.$completedHTML = this.$el.find("#completedHTML");
    },

    // ajax_get 
      // calls todolist.php which gets the data from the db and sends it back as a JSON string. ajax_get
      // runs appendElement which appends the element created by createElement to the DOM.
      // runs bindEvents to bind the events to the new elements
    render: function(){
      helperFunctions.isRunning("render");
      retrieveData.ajax_get();
    }
  }











  var helperFunctions = {
    tellUser: function(){
      toDoList.$todoHTML.html(this.tasksIncompleteNumber);
      toDoList.$completedHTML.html(this.tasksCompleteNumber);
    },
    IsJsonString: function(str){
      try {
        JSON.parse(str);
        } catch (e) {
            return false;
          }
        return true;
    },
    isRunning: function(fnName){
      console.log(fnName);
    },

    // appendElement is a child function that appends an element to the DOM. It is used by multiple modules.
      // gets array from parameter
      // runs createElement with parameter
      // appends items returned by createElement to DOM
    // function tree
      // ajaxGetSet() > appendElement() > createElement();
      // ajax_get() > appendElement() > createElement();
    appendElement: function(newdata){

      helperFunctions.isRunning("appendElement")
      var self = this; 
      //Create a listItem for each task (object) in newdata and bind it to the appropriate element.
      //This is the equivalent of a PHP foreach loop where key is just a counter to access items in the object: newdata[key] or newdata[0]
      for (var key in newdata) {
        // Create an element with the data provided
        var listItem = helperFunctions.createElement(newdata[key]);
          // Append the element to another element
          toDoList.$completedTasksHolder.append(listItem);
      }
      //for each task in newdata, check its task_status, and add the appropriate # to the task counters
      for (var key in newdata){
          toDoList.tasksCompleteNumber += 1;
      }

      helperFunctions.tellUser();
    },

    // createElement is a base child function that creates an element from its param. It is used by multiple modules.
      // gets array from parameter
      // creates an element from the parameter
      // returns element
    // function tree
      // addTask() > createElement()
      // ajax_get() > appendElement() > createElement()
      // ajaxGetSet() > appendElement() > createElement()
    createElement: function(taskString){
      helperFunctions.isRunning("createElement");
      //Create the new element containers for the tasks
      var listItem = document.createElement("li");
      listItem.id = taskString['id'];

      // The date input (CSS makes it appear when editing)
      var editDateInput = document.createElement("input");
      editDateInput.type = "date";
      editDateInput.className = "date-input";
      listItem.appendChild(editDateInput);
      
      // The date label
      var datelabel = document.createElement("label");
      datelabel.className = "date-label";
      listItem.appendChild(datelabel);
      // Create a date object to manipulate
      let entryDate = new Date(taskString['start']);
      //Add twelve hours since it moves time backwards for some reason
      entryDate.setUTCHours(12);
      // Convert that to human readable
      entryDate = entryDate.toDateString();
      // Before I can use entryDate, I have to convert it back to a date object so that when I edit it, it works
      datelabel.innerText = moment(taskString['start']).format('dddd, MMMM Do YYYY');

      // For the summary entry
      var sumContent = document.createElement("div");
      sumContent.className = "sum-content";
      listItem.appendChild(sumContent);
      sumContent.innerText = taskString['title'];
      // For the main entry
      var resizeInput = document.createElement("div");
      resizeInput.className = "resize-input";
      listItem.appendChild(resizeInput);
      resizeInput.innerText = taskString['description'];

      var editButton = document.createElement("button");
      var deleteButton = document.createElement("button");
      
      editButton.innerText = "Edit"; 
      editButton.className = "edit";
      deleteButton.innerText = "Delete";
      deleteButton.className = "delete";

      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);
  
      return listItem;
    },
  }











  // createEntry gets the user's input, creates an element from it, updates the tasks array with new data, and updates the database
  var createEntry = {

    // addTask is a parent function that add an entry from the user's input to the DOM when addButton is clicked
      // gets values from inputs and puts them into a variable
      // runs createElement with variable as param
      // runs ajaxAddEntry which updates database and li with new id
      // appends new elements from createElement to DOM
      // runs bindNewTask to bind events to new element
    // bound to addButton()
    // function tree
      // addTask() > createElement()
      // addTask() > ajaxAddEntry()
      // addTask() > bindNewTask()
    addTask: function(){
      helperFunctions.isRunning("addTask");
      // create a new element with the user's input
      
      // information to send to PHP
      var temptasks = {
        'title': toDoList.$summaryInput.val(),
        'task_action': 'add_task',
        'description': toDoList.$entryText.val(),
        'start': toDoList.$entryDate.val()
      };
      var listItem = helperFunctions.createElement(temptasks);
      // send info to PHP. PHP will use the info to update the DB
      this.ajaxAddEntry(temptasks, listItem);
      // prepend the list item to the top of the list
      toDoList.$completedTasksHolder.prepend(listItem);
      //remove the user's input from the $summaryInput box
      toDoList.$summaryInput.val("");
      toDoList.$entryText.val("");
      toDoList.$entryDate.val("");
      //Add 1 to # incomplete and display on screen
      toDoList.tasksCompleteNumber += 1;
      helperFunctions.tellUser();
      // bind the appropiate events to the new list item
      this.bindNewTask(listItem);
    },
    // ajaxAddEntry is a base child function that updates the database and tasks array with the new entry
      // gets array and element from parameters
      // sends array to todolist.php
      // updates task array
      // updates element with id from database when it is received
    // function tree
      // addTask() > ajaxAddEntry()
    ajaxAddEntry: function(inputText, listItem){
      helperFunctions.isRunning("ajax_add");
      var outerscope = this;
      // Create our XMLHttpRequest object
      var hr = new XMLHttpRequest();
      // Create some variables we need to send to our PHP file
      var url = toDoList.modVariables.server_folder_url + 'todolist.php';
      var taskData = 
        "title="+inputText['title']+
        // "&task_status="+inputText['task_status']+
        "&task_action="+inputText['task_action']+
        "&task_id="+inputText['id']+
        "&description="+inputText['description']+
        "&start="+inputText['start'];
      hr.open("POST", url, true);
      // Set content type header information for sending url encoded variables in the request allowing php to find stuff in taskData by $_POST['item'];
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // Access the onreadystatechange event for the XMLHttpRequest object
      hr.onreadystatechange = function() {
        //Once sends the information back, save it in return_data, test if it's real JSON with IsJsonString (parse it if is, log if it isn't), put the new object in newtaskobj(necessary), and add it to tasks
        if(hr.readyState == 4 && hr.status == 200) {
          var return_data = hr.responseText;
          var truetext = helperFunctions.IsJsonString(return_data);

          if (truetext) {
            var newtask = JSON.parse(return_data);
          } else {
            console.log("This is not valid JSON. Here is the return_data"+"\n"+return_data);
          };

          if (newtask != null) {
            var newtaskobj = newtask[0];
            tasks.push(newtaskobj);
          };

          listItem.id = newtaskobj['id'];
        }
      }
      // Send the data to PHP now... and wait for response to update the status div
      hr.send(taskData); // Actually execute the request
    },

    // bindNewTask is a base child function that binds events to a single new entry
      // gets element from param
      // binds events to element
    // function tree
      // addTask() > bindNewTask();
    bindNewTask: function(listItem) {
      var self = this;
      var checkBox = listItem.querySelector("[type=checkbox]");
      var deleteButton =  listItem.querySelector("button.delete");
      var editButton = listItem.querySelector("button.edit");

      editButton.onclick = function() { 
        editEntry.editTask(listItem)
      }
      deleteButton.onclick = function(){
        deleteEntry.deleteTask(listItem);
      }
    },
  }

















  var deleteEntry = {
    // deleteTask is a parent function that removes the entry from the DOM, database, and array
      // gets element from param
      // removes element from tasks array
      // removes element from DOM
    // bound to deleteButton
    // function tree
      // deleteTask() > ajax_delete_entry();
    deleteTask: function(taskListItem){
      helperFunctions.isRunning("deleteTask");
      //Get the appropriate elements
      var ul = taskListItem.parentNode;
      //loop through tasks array, and if text matches list item's text, update the database with ajax_post, and delete the item from tasks with task.splice
      for (var i=0; i <= tasks.length; i++) {
        if (tasks[i]['id'] === taskListItem.id) {
          tasks[i]['task_action'] = 'delete';
          myapi.ajax_mod(tasks[i], function(status, response) {
            console.log(response);
          });
          tasks.splice(i, 1);
          break;
        };
      }
      //Remove the parent list item from the ul
      ul.removeChild(taskListItem);
          toDoList.tasksCompleteNumber -= 1;
          helperFunctions.tellUser();
    },
  }


  var myapi = {

    // ajax_edit_entry is a base child function that updates the item in the database
      // gets array from param
      // sends param to todolist.php which updates the database
    // function tree
      // editTask() > ajax_edit_entry();
    ajax_mod: function(inputText, callback){
      helperFunctions.isRunning("ajax_post");
      var outerscope = this;
      // Create our XMLHttpRequest object
      var hr = new XMLHttpRequest();
      // Create some variables we need to send to our PHP file
      var url = toDoList.modVariables.server_folder_url + 'todolist.php';
      var taskData = 
        "title="+inputText['title']+
        // "&task_status="+inputText['task_status']+
        "&task_action="+inputText['task_action']+
        "&task_id="+inputText['id']+
        "&description="+inputText['description']+
        "&start="+inputText['start'];
      hr.open("POST", url, true);
      // Set content type header information for sending url encoded variables in the request allowing php to find stuff in taskData by $_POST['item'];
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // Access the onreadystatechange event for the XMLHttpRequest object
      hr.onreadystatechange = function() {
        //Once sends the information back, save it in return_data, test if it's real JSON with IsJsonString (parse it if is, log if it isn't), put the new object in newtaskobj(necessary), and add it to tasks
        if(hr.readyState == 4 && hr.status == 200) {
          callback(null, hr.responseText)

        } else {
          callback(hr.status, hr.responseText);
        }
      }
      // Send the data to PHP now... and wait for response to update the status div
      hr.send(taskData); // Actually execute the request
    },


  }













  var editEntry = {
    // editTask updates the view of the date, summary, and entry, updates the tasks array with new data, and updates database with new data
    // bound to edit-button
    // function tree
      // editTask() > ajax_edit_entry()
    editTask: function(taskListItem){
      helperFunctions.isRunning("editTask");

      // get the areas of content
      var dateInput = taskListItem.querySelector(".date-input");
      var entryArea = taskListItem.querySelector(".resize-input");
      var summaryArea = taskListItem.querySelector(".sum-content");
      var dateLabel = taskListItem.querySelector(".date-label");

      // if the date's input is blank, that means we are starting to edit and have not typed in anything, yet.
      if(dateInput.value == ''){
        // make the areas of the summary and entry editable
        entryArea.setAttribute('contenteditable', '');
        summaryArea.setAttribute('contenteditable', '');
        // add the class 'editMode'. CSS will target it and make certain items invisible
        taskListItem.className = 'editMode full-width';
        //Convert the human readable date to ISO format using moment.js
        //Ex.: Sunday, October 2nd 2016 to 2016-10-02
        let entryDate = moment(dateLabel.innerText, 'dddd, MMMM Do YYYY').format('YYYY-MM-DD');
        // make the value of the input to equal the inner text of the date label
        dateInput.value = entryDate;     
      } else {
        // if the date's input is not blank, make the summary and entry areas uneditable
        entryArea.removeAttribute('contenteditable');
        summaryArea.removeAttribute('contenteditable');
        // update the tasks array
        for (var key in tasks) {
          if (tasks[key]['id'] == entryArea.parentNode.id) {
            tasks[key]['title'] = summaryArea.innerText;
            tasks[key]['description'] = entryArea.innerText;
            tasks[key]['start'] = dateInput.value;
            tasks[key]['task_action'] = 'update';
            // pass the array from tasks to ajax_edit_entry()
            myapi.ajax_mod(tasks[key], function(status, response) {
              console.log(response);
            });
            break;
          }
        }
        //Ex.: 2016-10-02 to Sunday, October 2nd 2016
        let userNewDate = moment(dateInput.value).format('dddd, MMMM Do YYYY');
        // update the label with the user's input
        dateLabel.innerText = userNewDate;
        // remove the class name ".editMode" to show the inputs, again
        taskListItem.className = '';
        // refresh the input
        dateInput.value = '';
      }
    },
  }













  // retrieveData gets an array from the database, creates elements from that array, appends them to the DOM, and binds some events to them FOR the initial start of the program and FOR subsequent requests for more data
  var retrieveData = {
    
    // ajax_get is a child element that gets an array from the database, creates elements from the array, and bind events to them
      // calls todolist.php
      // gets JSON string from todolist.php, adds it to tasks array
      // runs appendElement with tasks array as param
      // runs bindEvents
    // function tree
      // render() > ajax_get() > appendElement() > createElement()
      // render() > ajax_get() > bindEvents()
    ajax_get: function(){
      helperFunctions.isRunning("ajax_get")
      //outerscope makes the IsJsonString method visible to if statements
      var self = this;
      // Create our XMLHttpRequest object
      var hr = new XMLHttpRequest();
      // Create some variables we need to send to our PHP file
      var url = toDoList.modVariables.server_folder_url + 'todolist.php';
      var taskData = "task_firstopen=taskfirstopen";

      hr.open("POST", url, true);
      // Set content type header information for sending url encoded variables in the request
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // Access the onreadystatechange event for the XMLHttpRequest object
      hr.onreadystatechange = function() {
        if(hr.readyState == 4 && hr.status == 200) {
          var return_data = hr.responseText;
          //check to see if it is valid JSON and run JSON.parse if it is
          var truetext = helperFunctions.IsJsonString(return_data);
          if (truetext) {
            tasks = JSON.parse(return_data);
            console.log(tasks);
            } else {
              console.log("This is not valid JSON. Here is the return_data"+"\n"+return_data);
            };
            //Run appendElement and udpate the page with the data retrieved from PHP.
            helperFunctions.appendElement(tasks);
            self.bindEvents();
        }
      }
      // Send the taskData to PHP now... and wait for response
      hr.send(taskData); // Actually execute the request
    },

    // bindEvents is a base child function that binds events to elements
      // binds editEntry(), deleteEntry(), ajaxGetSet(), addTask(), createEntry() to elements
    // function tree 
      // render() > ajax_get() > bindEvents();
    bindEvents: function(){
      helperFunctions.isRunning("bindEvents");
      var completedListItem = [];
      var incompleteListItem = [];
      var self = this;

       for (var i = 0; i < toDoList.$completedTasksHolder.find("li").length; i++) {
        (function(i) {

            incompleteListItem[i] = toDoList.$completedTasksHolder.find("li")[i];

            var editedInput = incompleteListItem[i].querySelector("input[type=text]");
            var checkBox = incompleteListItem[i].querySelector("[type=checkbox]");
            var deleteButton =  incompleteListItem[i].querySelector("button.delete");
            var editButton = incompleteListItem[i].querySelector("button.edit");

            editButton.onclick = function() { 
              editEntry.editTask(incompleteListItem[i])
            }
            deleteButton.onclick = function(){
              deleteEntry.deleteTask(incompleteListItem[i]);
            }

         }(i));
          
      }
      // Set the click handler to the addTask function
      toDoList.$selectButton.click(function() {
        retrieveData.ajaxGetSet(toDoList.$selectDateInput.val());
      });

      toDoList.$addButton.click(function() {
        createEntry.addTask();
      });
      // //allow user to hit enter instead of clicking addTask.
      // toDoList.$entryText[0].addEventListener('keypress', function (e) {
      //   var keys = e.which || e.keyCode;
      //   if (keys === 13) {
      //     createEntry.addTask();
      //   }
      // });
      toDoList.$selectDateInput[0].addEventListener('keypress', function (e) {
        var keys = e.which || e.keyCode;
        if (keys === 13) {
          toDoList.ajaxGetSet(toDoList.$selectDateInput.val());
        }
      });
    },

    // ajaxGetSet is a parent function that gets entries from the database, appends them to the DOM, and bind events to them
      // gets number from param
      // sends number to todolist.php which gets data based on number
      // receives JSON string from todolist.php and creates tasks array from it
      // runs appendElement with tasks array as param
      // runs bindGetEvents() which binds events to the new elements
    // bound to selectButton
    // function tree
      // ajaxGetSet() > appendElement() > createElement(); 
      // ajaxGetSet() > bindGetEvents()
    ajaxGetSet: function(entry_day){
      helperFunctions.isRunning("ajaxGetSet")
      //outerscope makes the IsJsonString method visible to if statements
      var self = this;
      // Create our XMLHttpRequest object
      var hr = new XMLHttpRequest();
      // Create some variables we need to send to our PHP file
      var url = toDoList.modVariables.server_folder_url + 'getset.php';
      var taskData = "entry_day=" + entry_day;

      hr.open("POST", url, true);
      // Set content type header information for sending url encoded variables in the request
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // Access the onreadystatechange event for the XMLHttpRequest object
      hr.onreadystatechange = function() {
        if(hr.readyState == 4 && hr.status == 200) {
          var return_data = hr.responseText;
          //check to see if it is valid JSON and run JSON.parse if it is
          var truetext = helperFunctions.IsJsonString(return_data);
          if (truetext) {
            tasks = JSON.parse(return_data); 
            } else {
              console.log("This is not valid JSON. Here is the return_data"+"\n"+return_data);
            };
            //Run appendElement and udpate the page with the data retrieved from PHP.
            toDoList.$completedTasksHolder[0].innerHTML = '';
            helperFunctions.appendElement(tasks);
            self.bindGetEvents();
        }
      }
      // Send the taskData to PHP now... and wait for response
      hr.send(taskData); // Actually execute the request
    },

    // bindGetEvents is a base child function that binds events to retrieved elements
      // binds editTask() AND deleteTask() to elements
    // function tree
      // ajaxGetSet() > bindGetEvents();
    bindGetEvents: function() {
      helperFunctions.isRunning("bindEvents");
      var completedListItem = [];
      var self = this;

      for (var i = 0; i < toDoList.$completedTasksHolder.find("li").length; i++) {
        (function(i) {

            completedListItem[i] = toDoList.$completedTasksHolder.find("li")[i];

            var editedInput = completedListItem[i].querySelector("input[type=text]");
            var checkBox = completedListItem[i].querySelector("[type=checkbox]");
            var deleteButton =  completedListItem[i].querySelector("button.delete");
            var editButton = completedListItem[i].querySelector("button.edit");
            var paragraph = completedListItem[i].querySelector(".p-entry-text");

            editButton.onclick = function() { 
              editEntry.editTask(completedListItem[i])
            }
            deleteButton.onclick = function(){
              deleteEntry.deleteTask(completedListItem[i]);
            }

         }(i));//I had to put this for loop in a self-executing function since for loops do not create scopes; otherwise completedListItem would only refer to the last one that the for loop ran. I guess putting it in a self-executing function creates a new scope for each bound item
          
      }
    }
  }

  toDoList.init(); 

  
  //Create the object to expose myModule's inner modules to Mocha
  var api = {
  }

  api.toDoList = toDoList;
  api.helperFunctions = helperFunctions;
  api.createEntry = createEntry;
  api.editEntry = editEntry;
  api.deleteEntry = deleteEntry;
  api.myapi = myapi;
  api.retrieveData = retrieveData;
  return api;

  
})();

