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
  }
  
  uploadSong(file: FileList){
    this.audioService.loadAudio(file);
    this.router.navigate(['audio-player']);
  }

  playSample() {
    this.audioService.loadAudio();
    this.router.navigate(['audio-player']);
  }

}
