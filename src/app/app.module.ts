import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { Sec2minPipe } from './shared/sec2min.pipe';
import { SeekComponent } from './song/seek/seek.component';
import { SongComponent } from './song/song.component';
import { VisualizerComponent } from './song/visualizer/visualizer.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SongComponent,
    SeekComponent,
    Sec2minPipe,
    VisualizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
