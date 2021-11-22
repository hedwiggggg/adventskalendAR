type RoundedRectProps = {
  posX: number;
  posY: number;

  width: number;
  height: number;

  radius: number;
};

declare global {
  interface CanvasRenderingContext2D {
    roundedRect(props: RoundedRectProps): void;
    drawVideoFrameCoverFit(video: HTMLVideoElement): void;
  }
}

if (typeof document !== 'undefined') {
  if (!('roundedRect' in CanvasRenderingContext2D.prototype)) {
    const rr_halfRadians = (2 * Math.PI) / 2;
    const rr_quarterRadians = (2 * Math.PI) / 4;  
  
    CanvasRenderingContext2D.prototype.roundedRect = (
      function drawRoundedRectangle(props) {
        const { posX, posY } = props;
        const { width, height } = props;
        const { radius } = props;
  
        this.arc(radius + posX, radius + posY, radius, -rr_quarterRadians, rr_halfRadians, true);
        this.lineTo(posX, posY + height - radius);
        this.arc(radius + posX, height - radius + posY, radius, rr_halfRadians, rr_quarterRadians, true);
        this.lineTo(posX + width - radius, posY + height);
        this.arc(posX + width - radius, posY + height - radius, radius, rr_quarterRadians, 0, true);
        this.lineTo(posX + width, posY + radius);
        this.arc(posX + width - radius, posY + radius, radius, 0, -rr_quarterRadians, true);
        this.lineTo(posX + radius, posY);
      }
    );
  }
  
  if (!('drawVideoFrameCoverFit' in CanvasRenderingContext2D.prototype)) {
    type CoverFitProps = {
      destinationWidth: number;
      destinationHeight: number;
    
      sourceWidth: number;
      sourceHeight: number;
    };
    
    type CoverFitResult = {
      posX: number;
      posY: number;
    
      width: number;
      height: number;
    };
    
    const coverFit = (props: CoverFitProps) => {
      const { destinationWidth, destinationHeight } = props;
      const { sourceWidth, sourceHeight } = props;
    
      const childRatio = destinationWidth / destinationHeight;
      const parentRatio = sourceWidth / sourceHeight;
    
      const result: CoverFitResult = {
        posX: 0,
        posY: 0,
    
        width: 0,
        height: 0,
      };  
    
      if (childRatio < parentRatio) {
        result.height = sourceWidth / childRatio;
        result.width = sourceWidth;
      } else {
        result.width = sourceHeight * childRatio;
        result.height = sourceHeight;
      }
    
      result.posX = (sourceWidth - result.width) / 2;
      result.posY = (sourceHeight - result.height) / 2;
    
      return result;
    }
      
    CanvasRenderingContext2D.prototype.drawVideoFrameCoverFit = (
      function drawVideoFrameCoverFit(video) {
        const coverFitResult = coverFit({
          destinationWidth: video.videoWidth,
          destinationHeight: video.videoHeight,
  
          sourceWidth: this.canvas.width,
          sourceHeight: this.canvas.height,
        });
  
        this.drawImage(video,
          coverFitResult.posX, coverFitResult.posY,
          coverFitResult.width, coverFitResult.height,
        );
      }
    );
  }  
}

export default undefined;
