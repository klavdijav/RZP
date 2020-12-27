import { Component, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    
  }

  onPlay() {
    this.audioService.play();
  }

  onPause() {
    this.audioService.pause();
  }

}
