import React, { PureComponent } from "react";
import { CanvasOverlay } from "react-map-gl";

export default class PolylineOverlay extends PureComponent {
  _redraw({ width, height, ctx, isDragging, project, unproject }) {
    const {
      points,
      lineColor = "red",
      circleColor = "blue",
      lineWidth = 8,
      renderWhileDragging = true
    } = this.props;
    ctx.clearRect(0, 0, width, height);
    // serve para definir como será a sobreposição das cores dos shapes
    // ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      // Draw lines
      ctx.beginPath();
      points.forEach(point => {
        const pixel = project([point[0], point[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
      // Draw Circles
      ctx.fillStyle = circleColor;
      points.forEach(point => {
        const pixel = project([point[0], point[1]]);
        ctx.beginPath();
        ctx.arc(pixel[0], pixel[1], 8, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }

  render() {
    return <CanvasOverlay redraw={this._redraw.bind(this)} />;
  }
}
