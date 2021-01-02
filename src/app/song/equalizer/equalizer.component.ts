import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss']
})
export class EqualizerComponent implements OnInit {

  effectActive = null;
  effectsControl = new FormControl();

  tremoloFrequency = 5;
  stereoTremoloFrequency = 1;

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    this.audioService.initTremolo();

    this.effectsControl.valueChanges.subscribe(value => {
      this.pauseCurrentEffect();
      switch(value){
        case 'tremolo': 
          this.audioService.playTremolo();
          break;
        case 'stereo-tremolo':
          this.audioService.playStereoTremolo();
          break;
      }
      this.effectActive = value;
    });
  }

  pauseCurrentEffect() {
    switch(this.effectActive){
      case 'tremolo': 
        this.audioService.pauseTremolo();
        break;
      case 'stereo-tremolo': 
        this.audioService.pauseStereoTremolo();
        break;
    }
  }

  changeTremoloFrequency(event: MatSliderChange){
    this.audioService.setTremoloFrequency(event.value);
  }

  changeStereoTremoloFrequency(event: MatSliderChange) {
    this.audioService.setStereoTremoloFrequency(event.value);
  }

}
