// global constants
var clueHoldTime = 1200;  //how long to hold each clue's light/sound
const cluePauseTime = 330; //how long to pause in between clues
const nextClueWaitTime = 1200; //how long to wait before starting playback of the clue sequence


//Global Variables
var guessCounter = 0;
var pattern = [3, 4, 4, 3, 2, 1, 3, 1, 5, 6];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var count = 0


/*
function--->StartGame, initialiazes the start of the game and switches the start button to stop,
unitl game lost, also calls the play sequence function
parameters--->None
*/
function startGame() {
    clueHoldTime = 1200;
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();

}


/*
function---> StopGame, functions similarly to the start game function, but hides
the stop button and apply the start button, always reset the clue hold time and the 
random pattern
parameters---> None
*/
function stopGame() {
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    pattern.sort(() => Math.random() - 0.5);
    var clueHoldTime = 1200;
}


/*
function--->Sound Synthesis Functions,
sets the frequencies for the 6 button audios
*/
const freqMap = {
    1: 300,
    2: 350,
    3: 380,
    4: 470,
    5: 400,
    6: 600
}


/*
function--->PlayTone, Plays the required tone fo the set time based on the inout values when invoked
paramaters--->btn, one of the six buttons and the lenght of time to play each tone
return value---> None
*/
function playTone(btn, len) {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function() {
        stopTone()
    }, len)
}


/*
function--->startTone,
Initializes the start of the playing of the tone when invoked until stoptone 
is invoked
paramters--->the button from the six buttons
return value---> None
*/
function startTone(btn) {
    if (!tonePlaying) {
        context.resume()
        o.frequency.value = freqMap[btn]
        g.gain.setTargetAtTime(volume, context.currentTime + 0.05,
            0.025)
        context.resume()
        tonePlaying = true
    }
}

/*
function--->stopTone, This function sets the tone playing to false thus stopping the startTone
function
parameters--->None
return value---> None
*/
function stopTone() {
    g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
    tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)


/*
function -->lightButton, adds the CSS class lit to the the class list of the appropriate button
allowing the button to light back when the computer is playing back
parameter---> the button from the six buttons
return value---> returns nothing
*/
function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit")
}


/*
function--->clearButton, removes the lit button class from the buttons class list 
after the computer has finished playing back
parameter---> the button number from the six buttons
return value--->returns nothing
*/
function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit")
}





/*
function--->playSingleClue, calls the lightButton function, and play the 
playTone function to play a single tone calls the setTimeout function by passing in
the clearButton function, the clueHoldTime and the button to stop playing the tone afterwards,
the clear button gets called only after the clueHoldTime is done
parameters--->the appropriate button within the six buttons
return value---> Returns None
*/
function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}





/*
function--->playSequence, plays a sequence of clues rather than a single clue
reduces clue holdtime anything a sequence is played.
parameters---> None
return Value---> None
*/
function playClueSequence() {
    context.resume()
    let delay = nextClueWaitTime; //set delay to initial wait time
    guessCounter = 0;
    count = 0;
    clueHoldTime -= 110;
    for (let i = 0; i <=
        progress; i++) {
        setTimeout(playSingleClue, delay, pattern[
            i]) 
        delay += clueHoldTime
        delay += cluePauseTime;

    }
}




/*
function--->loseGame, gets called when the user loses the game pattern three times
and then displays the alert message Game over
parameters--->None
return value--> None
*/
function loseGame() {
    count = 0;
    stopGame();
    alert("Game Over. You lost.");
}



/*
function--->winGame, gets invoked when the user has been able to 
play all the clues without missing up until when the lenght of progress equals the 
pattern length
parameters--->None
return Value-- None
*/
function winGame() {
    stopGame();
    alert("Game Over. You Won!");
}


/*
Function-->guess, checks for the guess by the user for its correctness and
calls the appropriate functions to determine either the user has won or lose
parameters--->the button in the six buttons
return value---> returns nothing;
*/
function guess(button) {

    if (gamePlaying) {

        if (pattern[guessCounter] != button) {
            count++;
            if (count == 3) {
                loseGame();
            } else {
                alert("You have " + (3 - count) + " chance " +
                    "left");
            }
        } else {
            if (guessCounter == progress) {
                  var size_pattern = pattern.length-1;
                if (progress == size_pattern) {
                    clueHoldTime = 1200;
                    winGame();
                } else {
                    progress++;
                    playClueSequence();
                }
            } else {
                guessCounter++;
            }
        }

    } else {
      
    }
}