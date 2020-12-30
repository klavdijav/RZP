import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvasElement: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    const canvas = this.canvasElement.nativeElement;
    this.context = canvas.getContext('2d');

    if (this.audioService.audioFile.src)
      this.visualize();
  }

  visualize() {
    const canvas = this.canvasElement.nativeElement;
    
    const center_x = canvas.width / 2;
    const center_y = canvas.height / 2;
    const radius = 100;
    const bars = 150;

    const drawLines =  () => {
      requestAnimationFrame(drawLines);

      const frequencyData = this.audioService.frequencyData;

      this.context.clearRect(0, 0, canvas.width, canvas.height);

      this.context.beginPath();
      this.context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
      this.context.stroke();
      
      for (let i = 0; i < bars; i++) {
        const rads = Math.PI * 2 / bars;
        
        const bar_height = frequencyData[i] * 0.4;
        
        const x = center_x + Math.cos(rads * i) * radius;
    	  const y = center_y + Math.sin(rads * i) * radius;
        const x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
        const y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
        
        this.drawBar(x, y, x_end, y_end, 2,frequencyData[i]);
      }
    }

    drawLines();
  }

  drawBar(x1, y1, x2, y2, width, frequency){
    
    var lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
    
    this.context.strokeStyle = lineColor;
    this.context.lineWidth = width;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
}

}
