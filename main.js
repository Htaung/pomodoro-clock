// Have a variable that stores the full 25 minutes.
// Have a var that stores 5 minutes of rest.
// Buttons are only available for clicking when the timer is stopped.

// Maybe internally only deal with seconds? Then display when needed but don't conver them anywhere in the app?

// TODO: get rid of innerHTML
// TODO: alternate background for work/rest
// TODO: Find out how to center the text in canvas
// TODO: On pause, the timer also updates with the default value
// TODO: Make sure relax mode is working as well
// TODO: Change mouse cursor when hovering over the buttons
// TODO: Maybe just stroke the original circle? (so it is transparent inside)
// TODO: Make it go from the very top
// TODO: Decrease the vertical space between the session/break lengths and the numbers

var restColor = '#591FCE';
var workColor = '00ADB5';

var display = document.getElementById('timer-display');
var displayStatus = document.getElementById('status');
var startBtn = document.getElementById('button-start');
var pauseBtn = document.getElementById('button-pause');
var resetBtn = document.getElementById('button-reset');
var moreWorkBtn = document.getElementById('more-work');
var lessWorkBtn = document.getElementById('less-work');
var moreRestBtn = document.getElementById('more-rest');
var lessRestBtn = document.getElementById('less-rest');
var displayUserWork = document.getElementById('user-work-display');
var displayUserRest = document.getElementById('user-rest-display');

var canvas = document.getElementById('pomodoro-display-canvas');
var ctx = canvas.getContext('2d');

var progressArc;
var canvasWidth = 400;
var canvasHeight = 400;
var centerX = 200;
var centerY = 200;

// Find a quick way to calculate the number of seconds in a given
var work = 25;
var rest = 5;

// two similar functions??

function getTotalSeconds(minutes, seconds) {
  return minutes * 60 + seconds;
}

function getSecFromObj(timeObj) {
  return timeObj.min * 60 + timeObj.sec;
}

function getMinSec(seconds) {
  console.log(`SECONDS from getMinSec - ${seconds}`);
  var min = Math.floor(seconds / 60);
  var sec = seconds - min * 60;

  //careful because now min is a number, sec is a string
  if (sec < 10) {
    sec = "0" + sec;
  }

  console.log(`MIN from getMinSec - ${min}`);
  console.log(`SEC from getMinSec - ${sec}`);

  return {
    min: min,
    sec: sec
  }
}


var runningTimer;
var timer = {
  isRunning: false,
  initWork: 25,
  initRest: 5,
  userWork: 25,
  userRest: 5,
  isWork: true,
  currMin: 0,
  currSec: 0,
  currTimeObj: {
    min: 0,
    sec: 0
  },
  secondsLeft: 0,
  displayTime: function(timeObj) {
    var timeDisplayed = timeObj.min + " : " + timeObj.sec;
    // display.innerHTML = timeDisplayed;  // change?
  },
  getIntoResetPotision: function() {
    var resetTime = getMinSec(this.getCorrectStartTime()); // change this
    console.log("RESET TIME IS: ");
    console.log(resetTime);
    this.displayTime(resetTime);

  },
  getCorrectStartTime: function() {
    // if there is currMin or currSec time available use that,
    if (timer.secondsLeft) {
      return timer.secondsLeft;
    } else {
      var workOrRest = timer.isWork ? timer.userWork : timer.userRest;
      return getTotalSeconds(workOrRest, 0);
    }
    // convert into seconds? or into the MinSec object and return to the function.
  },
  run: function(seconds) { // does it have to receive any arguments?
    timer.isRunning = true;

    // time to Start from in seconds.
    var startTimeSeconds = timer.getCorrectStartTime();
    console.log("CORRECT START TIME IN SECONDS IS: " + startTimeSeconds);
    var startTime = getMinSec(startTimeSeconds);
    console.log("START TIME INFO WE'RE CHECKING");
    console.log("Start Time MINS: " + startTime.min);
    console.log("Start Time SECS: " + startTime.sec);

    var currentTime = startTime; // maybe this is not needed? (the startTime var)
    var timeDisplayed = "";
    var secondsLeft = startTimeSeconds;
    // var secondsLeft = getSecFromObj(currentTime);

    // or workTimer VS restTimer
    runningTimer = setInterval(function() {
      // stop the timer if the time has passed.
      if (secondsLeft === 0) {
        clearInterval(runningTimer); // this works, but then has to go to rest instead of just stopping
        // change to restMode
        timer.isWork = !timer.isWork;
        // if timer.isWork === false, then change the background color to the color of rest
      }
      // it doesn't work because currentTime gets an object in.

      // This block is to display the current time on the timer.
      currentTime = getMinSec(secondsLeft);
      timer.displayTime(currentTime);

      // NEW
      timer.currMin = currentTime.min;
      timer.currSec = currentTime.sec;
      timer.currTimeObj = currentTime;

      console.log("*** *** *** CURRENT TIME: " + currentTime.min + " " + currentTime.sec + " " + " *** *** ***");
      // current time???
      updateCanvas(secondsLeft, currentTime); // ?? here ???

      secondsLeft -= 1;
      // Testing
      timer.secondsLeft = secondsLeft;
    }, 1000);

  },
  pause: function() {
    // if clicked once, stops the timer,
    timer.isRunning = false;
    clearInterval(runningTimer);
    // if clicked twice, continues running it
  },
  reset: function() {
    timer.isRunning = false;
    clearInterval(runningTimer);
    timer.secondsLeft = 0;
    timer.getIntoResetPotision();
  },
  getMinSec: function(mins) {
    return 5; // TEMP
  },
  increaseWork: function() {
    if (!timer.isRunning) {
      timer.userWork++;
      displayUserWork.innerHTML = timer.userWork;
      // display.innerHTML = timer.userWork;
      // NEW

    }
    timer.reset();
    updateCanvas();
    //updateCanvas(timer.secondsLeft, timer.currTimeObj); // instead of this, have a function that only updates the time in the middle
  },
  decreaseWork: function() {
    if (!timer.isRunning) {
      timer.userWork--;
      if (timer.userWork <= 0) {
        timer.userWork = 1;
      }
      // updateCanvas(timer.secondsLeft, timer.currTimeObj);
      displayUserWork.innerHTML = timer.userWork;
      // set the timer here with the userWork
      //display.innerHTML = timer.userWork;
    }
    timer.reset();
    updateCanvas();
  },
  increaseRest: function() {
    if (!timer.isRunning) {
      timer.userRest++;
      displayUserRest.innerHTML = timer.userRest;
    }
  },
  decreaseRest: function() {
    if (!timer.isRunning) {
      timer.userRest--;
      if (timer.userRest <= 0) {
        timer.userRest = 1;
      }
      displayUserRest.innerHTML = timer.userRest; // change to innerText?
    }

  }
}

// Attach Event Listeners to Buttons

startBtn.addEventListener("click", function() {
  // Read
  // Have a function to read the current mins and seconds.
  // Check if the timer is already running. if so either block the button, or start over every time it is pressed
  if (!timer.isRunning) {
    timer.run(25); // HERE SOME CHECK AS TO WHAT TIME SHOULD IT GET FED
    // Here also update the canvas with the right length of the arc and the time.
  }

  setTimeout(5000);

});

pauseBtn.addEventListener("click", function() {
  timer.pause();
});

resetBtn.addEventListener("click", function() {
  timer.reset();
  updateCanvas(); // check
});

// work buttons
moreWorkBtn.addEventListener("click", function() {
  timer.increaseWork();
  //updateCanvas(timer.secondsLeft, timer.currTimeObj); // check
  // updateCanvas();
});

lessWorkBtn.addEventListener("click", function() {
  timer.decreaseWork();
  // updateCanvas();
  // updateCanvas();
  // timer.reset();
  // updateCanvas(timer.secondsLeft, timer.currTimeObj); // check
});

// rest buttons
moreRestBtn.addEventListener("click", function() {
  timer.increaseRest();
  // timer.reset();
  updateCanvas();
  // updateCanvas(timer.secondsLeft, timer.currTimeObj); // check
});

lessRestBtn.addEventListener("click", function() {
  timer.decreaseRest();
  updateCanvas(); // check
});

canvas.addEventListener("click", function() {
  if (timer.isRunning) {
    timer.pause();
  } else {
    timer.run(timer.userWork); // or rest??? check this
  }
});

// Working with canvas

function drawCanvas() {
  // draw the circle
  var circle = new Path2D();
  ctx.fillStyle = "#EEEEEE";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#EEEEEE";
  // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

  //ctx.beginPath();
  circle.arc(canvasWidth / 2, canvasHeight / 2,150, 0, Math.PI*2, true); // Outer circle
  ctx.stroke(circle);
  console.log('the draw function gets called');

  ctx.font = "48px PT Mono";
  if (timer.isWork) {
    ctx.fillText("Focus", centerX, 120);
  } else {
    ctx.fillStyle = restColor;
    ctx.fillText("Relax", centerX, 120);
  }

  // ctx.font = "72px PT Mono";
  // ctx.textAlign = 'center';
  // ctx.fillText(timer.initWork, centerX, centerY + 30);

  // on top of the circle put the type of activity
  // add time in the center?
}

function initCanvas() {
  var circle = new Path2D();
  ctx.textAlign = 'center';
  ctx.fillStyle = "#EEEEEE";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#EEEEEE";
  // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

  //ctx.beginPath();
  circle.arc(canvasWidth / 2, canvasHeight / 2,150, 0, Math.PI*2, true); // Outer circle
  ctx.stroke(circle);
  console.log('the draw function gets called');

  ctx.font = "48px PT Mono";
  if (timer.isWork) {
    ctx.fillText("Focus", centerX, 120);
  } else {
    ctx.fillText("Relax", centerX, 120);
  }

  ctx.font = "72px PT Mono";
  ctx.fillText(timer.initWork, centerX, centerY + 30);
}

function updateCanvas(secondsLeft, timeObj) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCanvas();
  // full circle is 2 PI.
  if (timer.isWork) {
    var secondsOverall = timer.userWork * 60;
    ctx.fillStyle = workColor;
    ctx.strokeStyle = workColor;
  } else {
    var secondsOverall = timer.userRest * 60;
    ctx.fillStyle = restColor;
    ctx.strokeStyle = restColor;
  }
  // console.log("SECONDS LEFT WHEN UPDATING CANVAS: " + secondsLeft);
  // console.log("SECONDS OVERALL WHEN UPDATING CANVAS: " + secondsOverall);

  var secondsPassed = secondsOverall - secondsLeft;

  var percentageToDisplay = secondsPassed / secondsOverall;
  // what is the current number of Seconds overall
  var arcPartToShow = Math.PI * 2 * percentageToDisplay; // since we are showing what's done not what's left

  console.log("percentageToDisplay: " + percentageToDisplay);
  console.log("Arc part to show: " + arcPartToShow);

  ctx.lineWidth = 10;

  progressArc = new Path2D();
  progressArc.arc(canvasWidth / 2, canvasHeight / 2, 150, 0, arcPartToShow, false);
  ctx.stroke(progressArc);

  // show time
  var timeDisplayedOnCanvas;
  //console.log("******* Current min: " + timeObj.min + " Current sec: " + timeObj.sec);
  // ** THE timeObj is undefined here!!!
  if (timer.isRunning) {
    timeDisplayedOnCanvas = timeObj.min + ":" + timeObj.sec;
  } else {
    timeDisplayedOnCanvas = timer.userWork;
  }

  ctx.font = "72px PT Mono";
  ctx.fillText(timeDisplayedOnCanvas, centerX, centerY + 30); // change 30 to halfHeight of the time

  //
}

// then with time fill it with the right amount of color

function init() {
  initCanvas();
}


document.addEventListener("DOMContentLoaded", function(event) {
  init();
});




//
