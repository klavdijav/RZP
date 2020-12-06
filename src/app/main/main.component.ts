import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const CircularAudioWave;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  audioContext: AudioContext;
  audioFile: HTMLAudioElement;

  track: MediaElementAudioSourceNode;
  audioPlaying: boolean;

  @ViewChild('chartContainer') chartContainer: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
    this.audioContext = new AudioContext();
  }
  
  handleFileInput(file: FileList){
/*     this.audioFile = new Audio();
    this.audioFile.src = URL.createObjectURL(file.item(0));
    
    console.log(this.audioFile.duration, this.audioFile.currentTime);

    this.track = this.audioContext.createMediaElementSource(this.audioFile);

    this.track.connect(this.audioContext.destination); */

    let wave = new CircularAudioWave(this.chartContainer.nativeElement, {mode: 'sunburst'});
    wave.loadAudio(URL.createObjectURL(file.item(0)));
    setTimeout(() =>     wave.play(), 2000);
  }

  togglePlay() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (!this.audioPlaying) {
        this.audioFile.play();
        this.audioPlaying = true;
    } 
    else {
        this.audioFile.pause();
        this.audioPlaying = false;
    }
  }

}
