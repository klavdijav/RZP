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
  private pingPongGain: GainNode;
  private panner: StereoPannerNode;
  private biquadFilter: BiquadFilterNode;

  private filterFrequency = new BehaviorSubject<number>(0);
  private filterQ = new BehaviorSubject<number>(0);
  private filterGain = new BehaviorSubject<number>(0);
  private filterType = new BehaviorSubject<BiquadFilterType>('highpass');

  track: MediaElementAudioSourceNode;
  audioPlaying: boolean;
  private frequencyArray: Uint8Array;

  private state$ = new BehaviorSubject<AUDIO_EVENTS>(AUDIO_EVENTS.pause);
  private stop$ = new Subject();
  private AudioEvents = ["ended", "error", "playing", "pause", "timeupdate", "canplay"];

  constructor() { }

  loadAudio(file?: FileList) {
    if (file)
      this.audioFile.src = URL.createObjectURL(file.item(0));
    else 
      this.audioFile = new Audio('assets/guitar.mp3');
      
    this.analyser = this.audioContext.createAnalyser();

    this.track = this.audioContext.createMediaElementSource(this.audioFile);
    
    this.gain = this.audioContext.createGain();
    
    this.track.connect(this.gain);
    this.pingPongGain = this.audioContext.createGain();

    this.gain.connect(this.pingPongGain);
    
    this.panner = this.audioContext.createStereoPanner();
    this.pingPongGain.connect(this.panner);

    this.panner.connect(this.analyser);

    this.biquadFilter = this.audioContext.createBiquadFilter();

    this.analyser.connect(this.biquadFilter);

    this.filterFrequency.subscribe(value => {
      this.biquadFilter.frequency.value = value;
    });

    this.filterQ.subscribe(value => {
      this.biquadFilter.Q.value = value;
    });

    this.filterGain.subscribe(value => {
      this.biquadFilter.gain.value = value;
    });

    this.filterType.subscribe(value => {
      this.biquadFilter.type = value;
    });

    this.biquadFilter.connect(this.audioContext.destination);

    this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.audioContext.resume(); // Do not remove
    //this.audioFile.autoplay = true;

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

  // SIMPLE EFFECTS
  setFrequency(frequency: number) {
    this.filterFrequency.next(frequency);
  }

  setQ(q: number) {
    this.filterQ.next(q);
  }

  setGain(gain: number) {
    this.filterGain.next(gain);
  }

  setSimpleFilterType(type: BiquadFilterType) {
    this.filterType.next(type);
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

  // PING PONG DELAY
  private pingPongMerger: ChannelMergerNode;
  private pingPongLeftDelay: DelayNode;
  private pingPongRightDelay: DelayNode;
  private pingPongFeedback: GainNode;
  private pingPongDelayTime = new BehaviorSubject<number>(0.4);

  initPingPongDelay() {
    this.pingPongMerger = this.audioContext.createChannelMerger(2);
    
    this.pingPongLeftDelay = this.audioContext.createDelay();
    this.pingPongRightDelay = this.audioContext.createDelay();
    this.pingPongFeedback = this.audioContext.createGain();

    this.gain.connect(this.pingPongFeedback, 0);
    this.pingPongLeftDelay.connect(this.pingPongRightDelay);
    this.pingPongRightDelay.connect(this.pingPongFeedback);
    this.pingPongFeedback.connect(this.pingPongLeftDelay);
    
    this.pingPongFeedback.gain.value = 0.2;

    this.pingPongLeftDelay.connect(this.pingPongMerger, 0, 0);
    this.pingPongRightDelay.connect(this.pingPongMerger, 0, 1);
    this.pingPongMerger.connect(this.pingPongGain);

    this.pingPongDelayTime.subscribe(value => {
      this.pingPongLeftDelay.delayTime.value = value;
      this.pingPongRightDelay.delayTime.value = value;
    });
  }

  setPingPongDelayTime(delay: number) {
    this.pingPongDelayTime.next(delay);
  }

  pausePingPongDelay() {
    this.gain.disconnect(this.pingPongFeedback);
    this.pingPongMerger.disconnect(this.pingPongGain);
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
