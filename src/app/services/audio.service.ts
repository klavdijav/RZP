import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioFile = new Audio();
  private analyser: AnalyserNode;
  private audioContext = new AudioContext();

  track: MediaElementAudioSourceNode;
  audioPlaying: boolean;
  private frequencyArray: Uint8Array;

  private state$ = new BehaviorSubject<AUDIO_EVENTS>(null);
  private stop$ = new Subject();
  private AudioEvents = ["ended", "error", "playing", "pause", "timeupdate", "canplay"];

  constructor() { }

  loadAudio(file: FileList) {
    this.audioFile.src = URL.createObjectURL(file.item(0));
    this.analyser = this.audioContext.createAnalyser();

    this.track = this.audioContext.createMediaElementSource(this.audioFile);
    this.track.connect(this.analyser);
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

}

export enum AUDIO_EVENTS {
  ended = "ended",
  error = "error",
  playing = "playing",
  pause = "pause",
  timeupdate = "timeupdate",
  canplay = "canplay"
}
