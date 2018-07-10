var trainName = "";
var destination = "";
var firstTrainTime = "";
var monthsWorked = "";
var trainFrequency = 0;

var now = moment();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAgeHXqr9qPsIJYr2NNLTJybf-pUF5paEo",
  authDomain: "trains-ad59a.firebaseapp.com",
  databaseURL: "https://trains-ad59a.firebaseio.com",
  projectId: "trains-ad59a",
  storageBucket: "trains-ad59a.appspot.com",
  messagingSenderId: "679912353384"
};
firebase.initializeApp(config);
var database = firebase.database();

// add new entries from the UI to the database
$(document).ready(function() {
    $("#submitButton").click(function(event) {
        event.preventDefault();
        // grab things from the UI into vars
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstTrainTime = $("#firstTrainTimeInput").val();
        trainFrequency = $("#trainFrequencyInput").val();
        console.log("the submit box is: " + trainName);

        // Save new value to Firebase
        database.ref("/").push({
            'trainName': trainName,
            'destination': destination,
            'firstTrainTime': firstTrainTime,
            'trainFrequency': trainFrequency
        });  
    }); 
  });

  function persistEmployee(employee) {

  }

//   post updates to the UI when database is updated
  database.ref("/").on("child_added", function(snapshot) {

    // Print the local data to the console.
    // console.log(snapshot.val());
  
  
    // Change the HTML to reflect the local value in firebase.
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = snapshot.val().firstTrainTime;
    var startMoment = moment(firstTrainTime);
    var difference = (now.diff(startMoment, 'months'));
    monthsWorked = difference;
    trainFrequency = snapshot.val().trainFrequency;
  
    console.log("trainName: " + trainName + 
        "destination: " + destination +
        "firstTrainTime: " + firstTrainTime +
        "monthsWorked: " + monthsWorked +
        "trainFrequency: " + trainFrequency );
  
    createRow(trainName, destination, trainFrequency, firstTrainTime, 5 );

  // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  var createRow = function(trainName, destination, trainFrequency, nextArrivalTime, minutesAway) {
    // Get reference to existing tbody element, create a new table row element
    var tBody = $("tbody");
    var tRow = $("<tr>");

    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var nameTd = $("<td>").text(trainName);
    var destinationTd = $("<td>").text(destination);
    var firstTrainTimeTd = $("<td>").text(firstTrainTime);
    var trainFrequencyTd = $("<td>").text(trainFrequency);
    var nextArrivalTimeTd = $("<td>").text(nextArrivalTime);
    var minutesAwayTd = $("<td>").text(minutesAway);
    // Append the newly created table data to the table row
    tRow.append(nameTd, destinationTd, firstTrainTimeTd, trainFrequencyTd, nextArrivalTimeTd, minutesAwayTd);
    // Append the table row to the table body
    tBody.append(tRow);
  };

  

  
  