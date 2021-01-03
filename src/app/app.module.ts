import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { Sec2minPipe } from './shared/sec2min.pipe';
import { EqualizerComponent } from './song/equalizer/equalizer.component';
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
    VisualizerComponent,
    EqualizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
