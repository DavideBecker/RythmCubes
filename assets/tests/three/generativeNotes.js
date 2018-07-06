// Number of steps to play each chord.
STEPS_PER_CHORD = 8;
STEPS_PER_PROG = 4 * STEPS_PER_CHORD;

// Number of times to repeat chord progression.
NUM_REPS = 4;

// Set up Improv RNN model and player.
const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
// const player = new mm.Player();
// var playing = false;

// Current chords being played.
var currentChords = ["C", "G", "Am", "F"];

// Sample over chord progression.
const playOnce = () => {
    const chords = currentChords;

    // Prime with root note of the first chord.
    mm.chords.ChordSymbols.root(chords[0]);
    const seq = {
        quantizationInfo: {
            stepsPerQuarter: 4
        },
        notes: [],
        totalQuantizedSteps: 1
    };

    //   document.getElementById('message').innerText = 'Improvising over: ' + chords;
    return model.continueSequence(seq, STEPS_PER_PROG + (NUM_REPS - 1) * STEPS_PER_PROG - 1, 0.9, chords)
        // .then((contSeq) => {
        //     console.log('MAGENTA CONT', contSeq)
        //     // Add the continuation to the original.
        //     //   contSeq.notes.forEach((note) => {
        //     //     note.quantizedStartStep += 1;
        //     //     note.quantizedEndStep += 1;
        //     //     seq.notes.push(note);
        //     //   });

        //     //   const roots = chords.map(mm.chords.ChordSymbols.root);
        //     //   for (var i=0; i<NUM_REPS; i++) { 
        //     //     // Add the bass progression.
        //     //     seq.notes.push({
        //     //       instrument: 1,
        //     //       program: 32,
        //     //       pitch: 36 + roots[0],
        //     //       quantizedStartStep: i*STEPS_PER_PROG,
        //     //       quantizedEndStep: i*STEPS_PER_PROG + STEPS_PER_CHORD
        //     //     });
        //     //     seq.notes.push({
        //     //       instrument: 1,
        //     //       program: 32,
        //     //       pitch: 36 + roots[1],
        //     //       quantizedStartStep: i*STEPS_PER_PROG + STEPS_PER_CHORD,
        //     //       quantizedEndStep: i*STEPS_PER_PROG + 2*STEPS_PER_CHORD
        //     //     });
        //     //     seq.notes.push({
        //     //       instrument: 1,
        //     //       program: 32,
        //     //       pitch: 36 + roots[2],
        //     //       quantizedStartStep: i*STEPS_PER_PROG + 2*STEPS_PER_CHORD,
        //     //       quantizedEndStep: i*STEPS_PER_PROG + 3*STEPS_PER_CHORD
        //     //     });
        //     //     seq.notes.push({
        //     //       instrument: 1,
        //     //       program: 32,
        //     //       pitch: 36 + roots[3],
        //     //       quantizedStartStep: i*STEPS_PER_PROG + 3*STEPS_PER_CHORD,
        //     //       quantizedEndStep: i*STEPS_PER_PROG + 4*STEPS_PER_CHORD
        //     //     });        
        //     //   }

        //     // Set total sequence length.
        //     // seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS;
        // })
}

function prepareNotes() {
    return model.initialize()
}

function generateNotes() {
    generatingNotes = true

    return new Promise(function(resolve) {
        playOnce()
        .then((sequence) => {
            generatingNotes = false
            resolve(sequence)
        })
    })
}