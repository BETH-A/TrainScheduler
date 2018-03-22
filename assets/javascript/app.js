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
  // firstTrainTime = $("#inputFirstTrainTime").val().trim();
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

$("#inputTrainName").val("");
$("#inputDestination").val("");
$("#inputFirstTrainTime").val("");
$("#inputFrequency").val("");
});
  
database.ref().on("child_added", function(childSnapshot) {
    
  var minutesAway = calcMinAway(moment(childSnapshot.val().firstTrainTime, "HH:mm"), childSnapshot.val().frequency);
  var nextArrival = moment().add(minutesAway, 'minute');
  
  $("#employees > tbody").append("<tr id="+childSnapshot.key+"><td contenteditable> " + childSnapshot.val().name +
  " </td><td contenteditable> " + childSnapshot.val().destination +
  " </td><td contenteditable> " + childSnapshot.val().frequency +
  " </td><td> " + nextArrival.format('hh:mm A') +
  " </td><td> " + minutesAway + " </td><td> " +
  " <button type='sumbit' class='btn btn-primary btn-sm edit' value=" + childSnapshot.key +
  " ><span class='glyphicon glyphicon-ok' aria-hidden='true'></span></button> " +
  " <button type='sumbit' class='btn btn-primary btn-sm delete' value=" + childSnapshot.key +
  " ><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td></tr>");
  
  }, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
  });
  
  $(document).on("click", ".delete", function(){
  var key = $(this).val();
  $("#"+key).remove();
  database.ref(key).remove()
  })
  
  // Update train details whenever a user clicks the edit button
  $(document).on("click", ".edit", function(){
  var key = $(this).val();
  
  trainName = $("#"+key).find("td:nth-child(1)").text();
  trainDestination = $("#"+key).find("td:nth-child(2)").text();
  trainFrequency = $("#"+key).find("td:nth-child(3)").text();
  
  database.ref(key).update({
    name: trainName,
    destination: trainDestination,
    frequency: trainFrequency
  });
  });
  
  database.ref().on("child_changed", function(childSnapshot, prevChildKey) {
  
  var minutesAway = calcMinAway(moment(childSnapshot.val().firstTrainTime, "HH:mm"), childSnapshot.val().frequency);
  var nextArrival = moment().add(minutesAway, 'minute');
  
  $("#"+childSnapshot.key).find("td:nth-child(4)").text(nextArrival.format('hh:mm A'));
  $("#"+childSnapshot.key).find("td:nth-child(5)").text(minutesAway);
  
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  
  function calcMinAway(firstTrainTime, frequency) {
  var totalMinutesAway = firstTrainTime.diff(moment(), 'minute');
  
  if (totalMinutesAway > 0) {
    return totalMinutesAway + 1;
  }
  else if (totalMinutesAway == 0) {
    return totalMinutesAway;
  }
  else {
    return frequency - Math.abs(totalMinutesAway) % frequency;
  }
  }
  
  var providerGithub = new firebase.auth.GithubAuthProvider();
  
  function githubSignin() {
  firebase.auth().signInWithPopup(providerGithub).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
  
  
  console.log(token)
  console.log(user)
  }).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  
  console.log(error.code)
  console.log(error.message)
  });
  }
  
  function githubSignout(){
  firebase.auth().signOut()
  
  .then(function() {
  
  console.log('Signout successful!')
  }, function(error) {
  console.log('Signout failed')
  });
  }
  
  