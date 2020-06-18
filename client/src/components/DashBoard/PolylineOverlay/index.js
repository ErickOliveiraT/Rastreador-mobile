import React, { PureComponent } from "react";
import { CanvasOverlay } from "react-map-gl";

export default class PolylineOverlay extends PureComponent {
  _redraw({ width, height, ctx, isDragging, project, unproject }) {
    const {
      points,
      mousePosition,
      lineColor = "grey",
      circleColor = "black",
      lineWidth = 8,
      renderWhileDragging = true,
      setAlertMessage,
      handleAlertOpen
    } = this.props;
    ctx.clearRect(0, 0, width, height);
    // if don't have points to show, set message "Não houve atividade este dia."
    if ((renderWhileDragging || !isDragging) && points) {
      // serve para definir como será a sobreposição das cores dos shapes
      // ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      // Draw lines
      ctx.beginPath();
      points.forEach(point => {
        const pixel = project([point.coordinates[0], point.coordinates[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });

      ctx.stroke();

      // Draw Circles
      ctx.fillStyle = circleColor;
      points.forEach(point => {
        const pixel = project([point.coordinates[0], point.coordinates[1]]);
        ctx.beginPath();
        ctx.arc(pixel[0], pixel[1], 8, 0, 2 * Math.PI);
        if (ctx.isPointInPath(mousePosition.x, mousePosition.y)) {
          ctx.fillStyle = "red";
          const d = new Date(point.hour);
          setAlertMessage(d.toLocaleString("pt-BR"));
          handleAlertOpen();
        } else {
          ctx.fillStyle = "blue";
        }
        ctx.fill();
      });
    }
  }

  render() {
    return <CanvasOverlay redraw={this._redraw.bind(this)} />;
  }
}
