var delta = 0

var cubeLanes = 5
var cubeAmount = 20
var cubeSpacing = 5
var cubeGrid = {
    width: cubeLanes * cubeSpacing,
    height: cubeAmount * cubeSpacing
}

var debugging = false
var isRunning = false

var cubeSpeed = 0.01
var cubeProbability = 0.2
var healthModifierProbablility = 0.2

var score = 0
var highScore = localStorage.getItem('rythmCubesScore') || 0
var health = 3
var currentHealth = 0
var scoreElement = document.getElementById('score')
var gameOverElement = document.getElementById('game-over')

var canvas = document.getElementById('debugCanvas');
var context = canvas.getContext('2d');

var generatingNotes = false
var generatedNotes = []
var patternBacklog = []
var skippedNotes = 0
var tones = ["D2", "E2", "F#2", "A2", "B2"]

var stars = []

var synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
        attackCurve: "exponential"
    }
}).toMaster();
// var synth = new Tone.PolySynth(6, Tone.Synth).toMaster()
// synth.set("detune", -1200);
var backgroundSynth = new Tone.PluckSynth({
    attackNoise: 1,
    dampening: 4000,
    resonance: 0.7
}).toMaster()

//Helpers
var mouse = {}