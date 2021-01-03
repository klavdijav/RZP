import { Component, OnInit } from '@angular/core';

import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

  playing = false;

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {}

  uploadSong(file: FileList){
    this.audioService.loadAudio(file);
    this.playing = true;
  }

  playSample() {
    this.audioService.loadAudio();
    this.playing = true;
  }

}
