var trainName = "";
var destination = "";
var firstTrainTime = "";
var trainFrequency = 0;

var nextArrival = Object;
var minutesAway = 0;

var timertask = 0; 
var refreshIn = 60;

var dateTimeFormat = "MMMM Do YYYY, h:mm:ss a";

var now = moment().format(dateTimeFormat);

console.log("the military date/time is: " + moment("1159").format("HH:mm"));
console.log(moment("1159", 'HH:mm').format('hh:mm'));


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
$(document).ready(function () {
  $("#currentTime").text(now);
  timertask = setInterval(refreshCountdown, 1000);


  $("#submitButton").click(function (event) {
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

function refreshCountdown() {
  $("#refreshCountdown").text("Refresh in: " + --refreshIn);
  if (refreshIn <= 0) {
    updateAllTimes();
    refreshIn = 60;
  }
}

function updateAllTimes() {
  now = moment().format(dateTimeFormat);
  $("#currentTime").text(now);
  // update all train times here
}

//   post updates to the UI when database is updated
database.ref("/").on("child_added", function (snapshot) {

  // Print the local data to the console.
  // console.log(snapshot.val());


  // Change the HTML to reflect the local value in firebase.
  trainName = snapshot.val().trainName;
  destination = snapshot.val().destination;
  firstTrainTime = snapshot.val().firstTrainTime;
  var startMoment = moment(firstTrainTime);
  // var difference = (now.diff(startMoment, 'months'));
  trainFrequency = snapshot.val().trainFrequency;

  calculateArrivalsFromNow();
  console.log("received from call to func, minutesAway of: " + minutesAway);

  console.log("trainName: " + trainName +
    "destination: " + destination +
    "firstTrainTime: " + firstTrainTime +
    "trainFrequency: " + trainFrequency);

  createRow(trainName, destination, trainFrequency, nextArrival, minutesAway);

  // If any errors are experienced, log them to console.
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function calculateArrivalsFromNow() {
  // var currentTime = moment().format("HH:mm");
  var currentTime = moment();
  console.log("currentTime: " + currentTime);
  console.log("firstTrainTime is: " + firstTrainTime);
  // var startTime = moment(firstTrainTime, 'HH:mm').format('hh:mm');
  var startTime = moment(firstTrainTime, 'HH:mm');
  console.log("startTime: " + startTime.format("HH:mm"));
  minutesAway = currentTime.diff(startTime, 'minutes');
  console.log("diff in mins: " + minutesAway);
  if (minutesAway < 0) {
    minutesAway = startTime.diff(currentTime, 'minutes');
    console.log("now diff in mins: " + minutesAway);
  }
  nextArrival = moment(currentTime).add(minutesAway, 'minutes').format('hh:mm');
  console.log("arrival from now: " + nextArrival);
  

  // convert current time to military
  // if current time is less than firstTrainTime then calculate arrival based on diff from current to first (done)
  // else
  //    subtract first train time from current time then do modulus using frequency to get next arrival

  // get time now
  // post the current time on the UI
  // add a timertask to update the UI every 1 minute
  // read rows out of firebase
  // calculate next arrivals based on current time 1st train time and train Frequency
  // this should be done when each new train added (it will also be done by the 1 minute timer task)
}

// BONUS
// TODO - add timer task to update the UI every 1 minute
// TODO - add update and remove buttons on each row 
// TODO - firebase authentication through google or github accounts

function createRow(trainName, destination, trainFrequency, nextArrivalTime, minutesAway) {
  // Get reference to existing tbody element, create a new table row element
  var tBody = $("tbody");
  var tRow = $("<tr>");

  // Methods run on jQuery selectors return the selector they we run on
  // This is why we can create and save a reference to a td in the same statement we update its text
  var nameTd = $("<td>").text(trainName);
  var destinationTd = $("<td>").text(destination);
  var trainFrequencyTd = $("<td>").text(trainFrequency);
  var nextArrivalTimeTd = $("<td>").text(nextArrivalTime);
  var minutesAwayTd = $("<td>").text(minutesAway);
  // Append the newly created table data to the table row
  tRow.append(nameTd, destinationTd, trainFrequencyTd, nextArrivalTimeTd, minutesAwayTd);
  // Append the table row to the table body
  tBody.append(tRow);
}




