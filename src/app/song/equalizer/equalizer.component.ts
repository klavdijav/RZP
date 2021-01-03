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

  frequency = 0;
  filterQ = 0;

  tremoloFrequency = 5;
  stereoTremoloFrequency = 1;
  pingPongDelayTime = 0.4;

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
        case 'ping-pong': 
          this.audioService.initPingPongDelay();
          break;
        default: 
          this.changeSimpleFilterType(value);
          console.log("change value", value);
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
      case 'ping-pong': 
        this.audioService.pausePingPongDelay();
    }
  }

/*   changeFrequency(event: MatSliderChange) {
    this.audioService.
  } */

  changeTremoloFrequency(event: MatSliderChange){
    this.audioService.setTremoloFrequency(event.value);
  }

  changeStereoTremoloFrequency(event: MatSliderChange) {
    this.audioService.setStereoTremoloFrequency(event.value);
  }

  changePingPongDelayTime(event: MatSliderChange) {
    this.audioService.setPingPongDelayTime(event.value);
  }

  changeFrequency(event: MatSliderChange) {
    this.audioService.setFrequency(event.value);
  }

  changeQ(event: MatSliderChange) {
    this.audioService.setQ(event.value);
  }

  changeSimpleFilterType(type: BiquadFilterType) {
    this.audioService.setSimpleFilterType(type);
  }

}
