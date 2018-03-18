// Initialize Firebase
var config = {
  apiKey: "AIzaSyAyQmLi3gIII0DWU9QmKiriuada4IIDeyI",
  authDomain: "train-scheduler-82f13.firebaseapp.com",
  databaseURL: "https://train-scheduler-82f13.firebaseio.com",
  projectId: "train-scheduler-82f13",
  storageBucket: "train-scheduler-82f13.appspot.com",
  messagingSenderId: "993102084630"
};

firebase.initializeApp(config);

var name = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";

var database = firebase.database();

 $("#add-train").on("click", function(event) {
      event.preventDefault();
      
// Grab values from form input boxes
  name = $("#inputTrainName").val().trim();
  destination = $("#inputDestination").val().trim();
  firstTrainTime = $("#inputFirstTrainTime").val().trim();
  frequency = $("#inputFrequency").val().trim();
   
// Local object for holding train data
  var newTrain = {
    name: name,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  }

// Push train object to database
  database.ref().push(newTrain);

// var trainName = childSnapshot.val().name;
// var trainDestination = childSnapshot.val().destination;
// var trainStartTime = childSnapshot.val().firstTrainTime;
// var trainFrequency = childSnapshot.val().frequency;

// var traintrainStartTimeFormat = moment.unix(trainStartTime).format("MM/DD/YYYY");






var viewName = $("#display-name").text(name);    
var viewDestination = $("#display-destination").text(destination);
var viewFirstTrainTime = $("#display-frequency").text(firstTrainTime);
//  $("#display-arrival").text();
//  $("#display-away").text();
var tRow = $("tr")
var tBody = $("tbody")


database.ref().on("child_added", function(childSnapshot) {

// Calculate how long until next train and the time of arrival based on start time and frequency
var minutesAway = calcMinAway(moment(childSnapshot.val().firstTrainTime, "HH:mm"), childSnapshot.val().frequency);
var nextArrival = moment().add(minutesAway, 'minute');

// Handle any errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
  
  });
});
          
