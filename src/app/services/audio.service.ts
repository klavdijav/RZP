import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioFile = new Audio();
  private analyser: AnalyserNode;
  private audioContext = new AudioContext();
  private gain: GainNode;
  private panner: StereoPannerNode;

  track: MediaElementAudioSourceNode;
  audioPlaying: boolean;
  private frequencyArray: Uint8Array;

  private state$ = new BehaviorSubject<AUDIO_EVENTS>(AUDIO_EVENTS.playing);
  private stop$ = new Subject();
  private AudioEvents = ["ended", "error", "playing", "pause", "timeupdate", "canplay"];

  constructor() { }

  loadAudio(file: FileList) {
    this.audioFile.src = URL.createObjectURL(file.item(0));
    this.analyser = this.audioContext.createAnalyser();

    this.track = this.audioContext.createMediaElementSource(this.audioFile);

    this.gain = this.audioContext.createGain();
    
    this.track.connect(this.gain);

    this.panner = this.audioContext.createStereoPanner();
    this.gain.connect(this.panner);

    this.panner.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.audioContext.resume(); // Do not remove
    this.audioFile.autoplay = true;

  }

  play() {
    this.audioFile.play();
    this.state$.next(AUDIO_EVENTS.playing);
  }

  pause() {
    this.audioFile.pause();
    this.state$.next(AUDIO_EVENTS.pause);
  }

  seekTo(seconds) {
    this.audioFile.currentTime = seconds;
  }

  setVolume(volume: number) {
    this.audioFile.volume = volume;
  }

  get frequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.frequencyArray);
    return this.frequencyArray;
  }

  get state(): Observable<AUDIO_EVENTS> {
    return this.state$.asObservable();
  }

  get duration(): number {
    return this.audioFile.duration;
  }


  //TREMOLO EFFECT
  private tremoloShaper: WaveShaperNode;
  private tremoloLFO: OscillatorNode;
  private tremoloShaperDisconnected = false;
  private tremoloFrequency = new BehaviorSubject<number>(5);

  initTremolo() {
    this.tremoloShaper = this.audioContext.createWaveShaper();
    this.tremoloShaper.curve = new Float32Array([0,1]);
    this.tremoloShaper.connect(this.gain);
  }

  playTremolo() {
    if (this.tremoloShaperDisconnected)
      this.tremoloShaper.connect(this.gain);

    this.tremoloLFO = this.audioContext.createOscillator();

    this.tremoloFrequency.subscribe(data => {
      this.tremoloLFO.frequency.value = data;
    })

    this.tremoloLFO.connect(this.tremoloShaper);
    this.tremoloLFO.start(this.audioContext.currentTime);
  }

  setTremoloFrequency(frequency: number) {
    this.tremoloFrequency.next(frequency);
  }

  pauseTremolo() {
    this.tremoloLFO.frequency.value = 0;
    this.tremoloLFO.stop();
    this.tremoloLFO.disconnect();
    this.tremoloShaper.disconnect();
    this.tremoloShaperDisconnected = true;
  }

  // STEREO TREMOLO
  private stereoTremoloOscillator: OscillatorNode;
  private stereoTremoloFrequency = new BehaviorSubject<number>(1);  

  playStereoTremolo() {
    this.stereoTremoloOscillator = this.audioContext.createOscillator();
    this.stereoTremoloOscillator.connect(this.panner.pan);

    this.stereoTremoloFrequency.subscribe(value => {
      this.stereoTremoloOscillator.frequency.value = value;
    });

    this.stereoTremoloOscillator.start(this.audioContext.currentTime);
  }

  setStereoTremoloFrequency(frequency: number) {
    this.stereoTremoloFrequency.next(frequency);
  }

  pauseStereoTremolo() {
    this.stereoTremoloOscillator.stop();
  }
}

export enum AUDIO_EVENTS {
  ended = "ended",
  error = "error",
  playing = "playing",
  pause = "pause",
  timeupdate = "timeupdate",
  canplay = "canplay"
}
