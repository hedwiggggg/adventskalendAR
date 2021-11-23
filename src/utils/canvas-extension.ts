import { scanImageData } from 'zbar.wasm';
import type { Point } from "zbar.wasm";

type RoundedRectProps = {
  posX: number;
  posY: number;

  width: number;
  height: number;

  radius: number;
};

type QRCodePoints = {
  a: Point;
  b: Point;
  c: Point;
  d: Point;
};

type QRCodeScanRect = {
  posX: number;
  posY: number;

  width: number;
  height: number;
};

type QRCodeScanResult = {
  data: string;
  points: QRCodePoints;
};

declare global {
  interface CanvasRenderingContext2D {
    roundedRect(rect: QRCodeScanRect, radius: number): void;
    drawVideoFrameCoverFit(video: HTMLVideoElement): void;
    createScanRect(width: number, height: number): QRCodeScanRect;
    scanQRCode(rect: QRCodeScanRect): Promise<QRCodeScanResult | undefined>;
  }
}

if (typeof document !== 'undefined') {
  if (!('createScanRect' in CanvasRenderingContext2D.prototype)) {
    CanvasRenderingContext2D.prototype.createScanRect = (
      function createScanRect(width, height) {
        return {
          width,
          height,
      
          posX: (this.canvas.width - width) / 2,
          posY: (this.canvas.height - height) / 2,
        };
      }
    );
  }

  if (!('scanQRCode' in CanvasRenderingContext2D.prototype)) {
    const scanInterval = 50;
    let lastScan: number;

    CanvasRenderingContext2D.prototype.scanQRCode = (
      async function scanQRCode(rect) {
        const now = Date.now();

        if (now - lastScan < scanInterval)
          return;

        else
          lastScan = now;

        const image = this.getImageData(
          rect.posX, rect.posY,
          rect.height, rect.width,
        );
  
        const [scanSymbol] = await scanImageData(image);

        if (scanSymbol) {
          const [a, c, d, b] = scanSymbol.points.map(
            (p) => ({
              x: p.x + rect.posX,
              y: p.y + rect.posY,
            })
          );

          return {
            data: scanSymbol.decode(),
            points: { a, c, d, b },
          };
        }

        return;
      }
    );
  }

  if (!('roundedRect' in CanvasRenderingContext2D.prototype)) {
    const rr_halfRadians = (2 * Math.PI) / 2;
    const rr_quarterRadians = (2 * Math.PI) / 4;  
  
    CanvasRenderingContext2D.prototype.roundedRect = (
      function drawRoundedRectangle(rect, radius) {
        const { posX, posY } = rect;
        const { width, height } = rect;

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
