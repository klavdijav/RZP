import { Component, OnInit } from '@angular/core';

import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss']
})
export class EqualizerComponent implements OnInit {

  tremoloActive = false;
  value = 6;

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    this.audioService.initTremolo();
  }

  toggleTremolo(play) {
    if (play)
      this.audioService.playTremolo(5);
    else 
      this.audioService.pauseTremolo();
  }

  setValue(){
    this.audioService.setTremoloFrequency(this.value);
    this.value = this.value + 10;
  }

}
