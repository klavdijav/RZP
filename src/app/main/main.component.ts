import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('chartContainer') chartContainer: ElementRef<HTMLElement>;

  constructor(
    private audioService: AudioService,
    private router: Router
  ) { }

  ngOnInit(): void {
   /*  this.audioService.state.subscribe(state => {
      console.log(state);
    }) */
  }
  
  uploadSong(file: FileList){
    this.audioService.loadAudio(file);
    this.router.navigate(['audio-player'])
    //this.audioService.play();
    //this.streamService.playStream(URL.createObjectURL(file.item(0))).subscribe();
/*     this.audioFile = new Audio();
    this.audioFile.src = URL.createObjectURL(file.item(0));
    
    console.log(this.audioFile.duration, this.audioFile.currentTime);

    this.track = this.audioContext.createMediaElementSource(this.audioFile);

    this.track.connect(this.audioContext.destination); */

    /* let wave = new CircularAudioWave(this.chartContainer.nativeElement, {mode: 'sunburst'});
    wave.loadAudio(URL.createObjectURL(file.item(0)));
    setTimeout(() =>     wave.play(), 2000); */
  }
/* 
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
  } */

}
