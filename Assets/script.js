// Global Variables
var userDate = $("#currentDay");
var container = $("#container");
var today = moment().format("dddd, MMMM Do YYYY");
var day = moment().startOf('day');
// Variable storing data input by user.
var savedData = {
  value: [""],
  expiry: moment().format('dddd, MMMM Do YYYY')
};
// Check local storage for information in the createHour.
if (localStorage.getItem("calItems") === null) {
  localStorage.setItem("calItems", JSON.stringify(savedData));
  savedData = JSON.parse(localStorage.getItem("calItems").split(","));
} else {
  savedData = localStorage.getItem("calItems");
  savedData = JSON.parse(savedData.split(","));

//  createHour clears daily. statment checks for information for the date, when the date changes, information is cleared.
  if (savedData.expiry !== moment().format('dddd, MMMM Do YYYY')) {
    localStorage.removeItem("calItems");
    localStorage.setItem("calItems", JSON.stringify({
      value: [""],
      expiry: moment().format('dddd, MMMM Do YYYY')
    }));
    savedData = JSON.parse(localStorage.getItem("calItems").split(","));
    alert("Yesterdays events have been cleared");
  }
}

// Generate hour blocks starting at 9 am
var createHour = function () {
  for (let i = 0; i < 9; i++) {
    // Time element
    var timeBlock = $("<div></div>");
    timeBlock.addClass("time-block row");

    // Hour element
    var hour = $("<div></div>");
    hour.addClass("hour");
    timeBlock.append(hour);

    //Appointment area
    var description = $("<div></div>");
    description.addClass("textarea description");
    description.attr("data-time", 9 + i)
    // Adds placeholder instructing user to type
    var textArea = $("<textarea id='appointment' placeholder='Type reminder here....'></textarea>");
    if (savedData !== null) {
      textArea.text(savedData.value[i]);
    } else {
      textArea.text("");
    }
    // append textarea to description and description to timeBlock
    textArea.attr("data-value", i);
    description.append(textArea);
    timeBlock.append(description);

    // creates the save the button
    var saveBtn = $("<div></div>");
    saveBtn.addClass("saveBtn");
    saveBtn.append("<i id='save' class='fas fa-save'></i>");
    timeBlock.append(saveBtn);

    // Push timeBlock to container
    container.append(timeBlock);
  }
}

function populateCalendar() {
  // Sets the Date on the Header
  userDate.text(today);
  createHour();

  // variables that work with putting correct time for each time slot
  var hour = 9;
  var afternoon = 1;
  var time = Number.parseInt(moment().format('H'));

  // auto generates the correct color coding for the time block aswell as correct
  // times for each timeBlock
  for (let i = 0; i < container.children().length; i++) {
    if (hour > 12) {
      container.children().eq(i).children().eq(0).text(afternoon + "pm");
      afternoon++;
    } else {
      if (hour === 12) {
        container.children().eq(i).children().eq(0).text(hour + "pm");
        hour++;
      } else {
        container.children().eq(i).children().eq(0).text(hour + "am");
        hour++;
      }
    }

    // grabs the data-time value attribute
    var dataTime = Number.parseInt(container.children().eq(i).children().eq(1).attr("data-time"));

    // Choose color based on time
    if (time < dataTime) {
      container.children().eq(i).children().eq(1).addClass("future")
    } else if (time === dataTime) {
      container.children().eq(i).children().eq(1).addClass("present")
    } else {
      container.children().eq(i).children().eq(1).addClass("past")
    }
  }
}

container.on("click", "#save", function (event) {
  var newArr = savedData;
  var index = $(event.target).parent().parent().children().eq(1).children().attr("data-value");
  var text = $(event.target).parent().parent().children().eq(1).children().val();
  newArr.value[index] = text;
  localStorage.setItem("calItems", JSON.stringify(newArr));
});

populateCalendar();