import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { AUDIO_EVENTS, AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-seek',
  templateUrl: './seek.component.html',
  styleUrls: ['./seek.component.scss']
})
export class SeekComponent implements OnInit {

  state: AUDIO_EVENTS = AUDIO_EVENTS.pause;
  currentTime: number = 0;
  duration: number = 0;

  styles: Partial<CSSStyleDeclaration> = {
    cursor: "pointer"
  };

  private destroy$ = new Subject();
  private pauseSubscription = false;

  @ViewChild("progress", { static: true }) progressElement: ElementRef;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioService.state.subscribe(data => {
      if (this.pauseSubscription) {
        return;
      }
      this.state = data;
      console.log(data);
    });

    
    this.audioService.audioFile.addEventListener("timeupdate", (event: any) => {
      this.currentTime = event.path[0].currentTime;
      this.duration = this.audioService.duration;
    });

   /*  fromEvent<MouseEvent>(this.progressElement.nativeElement, "mousedown")
      .pipe(
        switchMap(event => {
          event.preventDefault();
          this.pauseSubscription = true;
          return fromEvent<MouseEvent>(document, "mousemove").pipe(
            takeUntil(
              fromEvent<MouseEvent>(document, "mouseup").pipe(
                tap(event => {
                  this.onSeek(event);
                  this.pauseSubscription = false;
                })
              )
            )
          );
        })
      )
      .subscribe(event => {
        const offset =
          event.pageX -
          this.progressElement.nativeElement.getBoundingClientRect().left;
        const offsetPercentage =
          offset / this.progressElement.nativeElement.clientWidth;
       /*  const seconds = this.state.duration * offsetPercentage;
        this.state.currentTime = Math.max(
          0,
          Math.min(seconds, this.state.duration)
        ); 
      }); */
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onSeek(event: MouseEvent) {
    const offset =
      event.pageX -
      this.progressElement.nativeElement.getBoundingClientRect().left;
    const offsetPercentage =
      offset / this.progressElement.nativeElement.clientWidth;
   /*  const seconds = this.state.duration * offsetPercentage;
    this.state.currentTime = seconds;
    this.audioService.seekTo(seconds); */
  }

  toggleplay() {
    if (this.state === AUDIO_EVENTS.playing) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }

}