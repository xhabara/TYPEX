let sounds = {};
let loopButton, stopButton, delaySlider, delayEffectButton;
let looping = false;
let delayActive = false;
let loopIndex = 0;
let characters = [];
let duration = 100;
let delay;  
let sequenceButton, playSequenceButton;
let sequence = [];
let playingSequence = false; 
let currentLoopIndex = 0;

let recorder, soundFile;
let isRecording = false;
let saveButton;


function preload() {
  
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
  
  
}

function setup() {
  createCanvas(250, 800);
  background('#202020');
  
  recorder = new p5.SoundRecorder();
soundFile = new p5.SoundFile();

  let input = createInput();
  input.position(20, 65);

  input.input(function() {
    characters = input.value().toUpperCase().split('');
    let keyPressed = characters[characters.length - 1];
    if (sounds[`Key${keyPressed}`]) {
      sounds[`Key${keyPressed}`].play();
    }
  });

saveButton = createButton("Start Recording");
saveButton.position(20, 280);  // Adjust the position as you like
saveButton.mousePressed(toggleRecording);


loopButton = createButton('Test Playing');
loopButton.position(20, 120);
loopButton.mousePressed(function() {
  if (looping) {
    looping = false;
  
    for (let key in sounds) {
      sounds[key].stop();
    }
    loopButton.html('Play'); 
  } else {
    
    loopIndex = 0;
    looping = true;
    loopSounds(); 
    loopButton.html('Stop'); 
  }
});


  delaySlider = createSlider(0, 500, 50);
  delaySlider.position(20, 170);
  delaySlider.style('width', '200px'); 
  delaySlider.style('background-color', '#FF5722'); 
  delaySlider.style('-webkit-slider-thumb', 'background-color: #009688; width: 20px; height: 20px;');

  delayEffectButton = createButton('Activate Delay');
  delayEffectButton.position(152, 120);
  delayEffectButton.mousePressed(function() {
    delayActive = !delayActive;  
    delayEffectButton.html(delayActive ? 'Deactivate Delay' : 'Activate Delay');  // update the button text
  });

  // set up the delay effect
  delay = new p5.Delay();
  delay.setType('feedback'); 
  

sequenceButton = createButton('Add to Sequence');
sequenceButton.position(20, 230);
sequenceButton.style('background-color', '#009688'); 
sequenceButton.mousePressed(function() {
  // Add the current loop to the sequence
  sequence.splice(currentLoopIndex + 1, 0, [...characters]); 
  console.log('Current sequence:', sequence);  
});


playSequenceButton = createButton('Play Sequence');
playSequenceButton.position(135, 230);
playSequenceButton.style('background-color', '#FF5722'); 
playSequenceButton.mousePressed(function() {
  playingSequence = !playingSequence; 
  if (playingSequence) {
    playSequenceButton.html('Stop Sequence'); 
    playSequence(0); 
  } else {
    playSequenceButton.html('Play Sequence'); 
    stopAllSounds(); 
  }
});


  

}


function draw() {
  background('#202020');

  // Title
  fill('#F6F1F2');
  textSize(10);
  textFont('Courier New');
  text('TYPEX 1.2', 12, 40);

  
  let lines = [];
  let line = 'Sequence: ';
  for (let i = 0; i < sequence.length; i++) {
    let nextChunk = sequence[i].join('') + (i < sequence.length - 1 ? ' | ' : '');
    if (textWidth(line + nextChunk) > width - 20) {
      lines.push(line);
      line = nextChunk;
    } else {
      line += nextChunk;
    }
  }
  lines.push(line); 

  // Display each line
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], 12, 400 + i * 20); 
  }


  fill('#FFFFFF');
  textSize(12);
  text('Now Playing: ' + (characters.join('') || 'N/A'), 12, 400 + lines.length * 20);
}


  function loopSounds(callback) {
  if (looping && loopIndex < characters.length) { 
    for (let key in sounds) {
      sounds[key].stop();
    }

  if (characters[loopIndex] !== ' ') {  
  let soundToPlay = sounds[`Key${characters[loopIndex]}`];
  if (soundToPlay) {
    soundToPlay.play();

    // Add this line to route the sound through the recorder
    if (isRecording) {
      recorder.setInput(soundToPlay);
    }
    
    if (delayActive) {
      delay.process(soundToPlay, 0.5, 0.6, 3300);
    } else {
      delay.feedback(0);
      delay.delayTime(0);
    }
  }
}


    loopIndex++; 
    setTimeout(function() {
      loopSounds(callback);
    }, duration + delaySlider.value());
  } else if (callback) { 
    callback(); 
  }
}



function playLoop(loop, index, callback) {
  currentLoopIndex = index; 
  characters = loop;
  loopIndex = 0;
  looping = true;
  loopSounds(function() {
    looping = false;
    characters = []; 
    callback(index + 1);
  });
}

function playSequence(index) {
  if (playingSequence) { 
    if (index < sequence.length) {
      playLoop(sequence[index], index, playSequence);
    } else {
      console.log('Sequence completed, looping now');
      playSequence(0); 
    }
  }
}


function stopAllSounds() {
  looping = false; 
  for (let key in sounds) {
    sounds[key].stop();
  }
}

function toggleRecording() {
  if (!isRecording) {
    recorder.record(soundFile);
    saveButton.html('Stop Recording');
    isRecording = true;
  } else {
    recorder.stop();
    saveButton.html('Download Recording');
    soundFile.save('XhabarabotTypedSequence.wav');
    isRecording = false;
  }
}

