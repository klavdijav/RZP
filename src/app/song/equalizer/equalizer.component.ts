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

  tremoloActive = false;

  effectsControl = new FormControl();

  tremoloFrequency = 0;

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    this.audioService.initTremolo();

    this.effectsControl.valueChanges.subscribe(value => {
      switch(value){
        case 'tremolo': 
          this.toggleTremolo(true);
      }
    })
  }

  toggleTremolo(play) {
    if (play)
      this.audioService.playTremolo(0);
    else 
      this.audioService.pauseTremolo();
  }

  changeTremoloFrequency(event: MatSliderChange){
    this.audioService.setTremoloFrequency(event.value);
  }

}
