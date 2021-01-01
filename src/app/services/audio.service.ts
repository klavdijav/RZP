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
    this.gain.connect(this.analyser);
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
  private tremoloFrequency = new BehaviorSubject<number>(0);

  initTremolo() {
    this.tremoloShaper = this.audioContext.createWaveShaper();
    this.tremoloShaper.curve = new Float32Array([0,1]);
    this.tremoloShaper.connect(this.gain);
  }

  playTremolo(frequency: number) {
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
}

export enum AUDIO_EVENTS {
  ended = "ended",
  error = "error",
  playing = "playing",
  pause = "pause",
  timeupdate = "timeupdate",
  canplay = "canplay"
}
