let sounds = {};
let loopButton, stopButton, delaySlider, delayEffectButton;
let looping = false;
let delayActive = false;
let loopIndex = 0;
let characters = [];
let duration = 100;
let delay;  // this will hold the delay effect

function preload() {
  // preload all sounds, use your own sound files here
  sounds['KeyA'] = loadSound('a.wav');
  sounds['KeyB'] = loadSound('b.mp3');
  sounds['KeyC'] = loadSound('c.mp3');
  sounds['KeyD'] = loadSound('d.mp3');
  sounds['KeyE'] = loadSound('e.wav');
  sounds['KeyF'] = loadSound('f.wav');
  sounds['KeyG'] = loadSound('g.wav');
  sounds['KeyH'] = loadSound('h.wav');
  sounds['KeyI'] = loadSound('i.wav');
  sounds['KeyJ'] = loadSound('j.wav');
  sounds['KeyK'] = loadSound('k.wav');
  sounds['KeyL'] = loadSound('l.wav');
  sounds['KeyM'] = loadSound('m.wav');
  sounds['KeyN'] = loadSound('n.wav');
  sounds['KeyO'] = loadSound('o.mp3');
  sounds['KeyP'] = loadSound('p.mp3');
  sounds['KeyQ'] = loadSound('q.mp3');
  sounds['KeyR'] = loadSound('r.mp3');
  sounds['KeyS'] = loadSound('s.mp3');
  sounds['KeyT'] = loadSound('t.mp3');
  sounds['KeyU'] = loadSound('u.mp3');
  sounds['KeyV'] = loadSound('v.mp3');
  sounds['KeyW'] = loadSound('w.mp3');
  sounds['KeyX'] = loadSound('x.mp3');
  sounds['KeyY'] = loadSound('y.mp3');
  sounds['KeyZ'] = loadSound('z.mp3');
  
  // ... add as many keys as you want, one for each key on your keyboard
}

function setup() {
  createCanvas(250, 300);
  let input = createInput();
  input.position(20, 65);

  input.input(function() {
    // when something is typed, update the array of characters
    characters = input.value().toUpperCase().split('');
    // find the key pressed
    let keyPressed = characters[characters.length - 1];
    // if that key has a sound assigned, play it
    if (sounds[`Key${keyPressed}`]) {
      sounds[`Key${keyPressed}`].play();
    }
  });

  loopButton = createButton('Loop');
  loopButton.position(20, 100);
  loopButton.mousePressed(function() {
    // start looping from the first character
    loopIndex = 0;
    looping = true;
    loopSounds();  // start the loop
  });

  stopButton = createButton('Stop');
  stopButton.position(90, 100);
  stopButton.mousePressed(function() {
    // stop the loop
    looping = false;
    // stop all sounds
    for (let key in sounds) {
      sounds[key].stop();
    }
  });

  delaySlider = createSlider(0, 1000, 2000);
  delaySlider.position(20, 170);

  delayEffectButton = createButton('Activate Delay');
  delayEffectButton.position(20, 190);
  delayEffectButton.mousePressed(function() {
    delayActive = !delayActive;  // flip the delayActive boolean
    delayEffectButton.html(delayActive ? 'Deactivate Delay' : 'Activate Delay');  // update the button text
  });

  // set up the delay effect
  delay = new p5.Delay();
  delay.setType('feedback'); // a stereo effect
}

function draw() {
  background(220);
  text('TYPEX', 12, 50);
  text(20, 160);
}
function loopSounds() {
  if (looping && characters[loopIndex]) {
    // stop all sounds before playing the new one
    for (let key in sounds) {
      sounds[key].stop();
    }

    if (characters[loopIndex] !== ' ') {  // if the character is not a space
      // play the sound for the current character
      let soundToPlay = sounds[`Key${characters[loopIndex]}`];
      if (soundToPlay) {
        soundToPlay.play();
        // if delay is active, connect the sound to the delay effect
        if (delayActive) {
          delay.process(soundToPlay, 0.5, 0.6, 3300);
        } else {
          // otherwise, set feedback and delay time to 0
          delay.feedback(0);
          delay.delayTime(0);
        }
      }
    }

    // move to the next character, or loop back to the start
    loopIndex = (loopIndex + 1) % characters.length;
    // wait for the duration of the sound plus the slider value before playing the next one
    setTimeout(loopSounds, duration + delaySlider.value());
  }
}
