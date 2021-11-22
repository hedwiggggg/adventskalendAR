import { scanImageData } from 'zbar.wasm';
import { transform2d } from '~/utils/matrix-operations';

import '~/utils/canvas-extension';

type CreateDrawLoopProps = {
  cameraVideoRef?: React.RefObject<HTMLVideoElement>;
  overlayRef?: React.RefObject<HTMLVideoElement>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;

  onScanStart: (hash: string) => void;
  onScanEnd: () => void;
}

export default (
  function createScannerLoop(props: CreateDrawLoopProps) {
    const { overlayRef, canvasRef } = props;
    const { cameraVideoRef } = props;

    const { onScanStart } = props;
    const { onScanEnd } = props;

    let isRunning = true;
    let hideOverlayTimeout: NodeJS.Timeout | undefined;
    let lastScannedHash: string | undefined;

    async function scannerLoop() {
      if (!overlayRef?.current || !canvasRef?.current || !cameraVideoRef?.current) {
        return requestAnimationFrame(scannerLoop);
      }

      const ctx = canvasRef.current.getContext('2d');
      const scanRect = {
        canvas: canvasRef.current,

        width: 300,
        height: 300,

        get posX() {
          return (this.canvas.width - this.width) / 2;
        },

        get posY() {
          return (this.canvas.height - this.height) / 2;
        }
      };

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      overlayRef.current.width = scanRect.width;
      overlayRef.current.height = scanRect.height;

      if (!ctx) {
        return requestAnimationFrame(scannerLoop);
      }

      ctx.drawVideoFrameCoverFit(cameraVideoRef.current);

      const image = ctx.getImageData(
        scanRect.posX,
        scanRect.posY,
        scanRect.height,
        scanRect.width,
      );

      const [scanSymbol] = await scanImageData(image);

      ctx.strokeStyle = "#d4c7d9";
      ctx.lineWidth = 6;
      ctx.beginPath();

      ctx.roundedRect({
        posX: scanRect.posX,
        posY: scanRect.posY,

        width: scanRect.width,
        height: scanRect.height,

        radius: 16,
      });

      ctx.stroke();

      if (scanSymbol) {
        const scannedHash = scanSymbol.decode();
        const [a, b, c, d] = [...scanSymbol.points].map(
          (p) => ({
            x: p.x + scanRect.posX,
            y: p.y + scanRect.posY
          })
        );

        const matrix = transform2d(
          scanRect.width,
          scanRect.height,

          a.x, a.y,
          d.x, d.y,
          b.x, b.y,
          c.x, c.y,
        );

        overlayRef.current.style.opacity = '1';
        overlayRef.current.style.transform = `matrix3d(${matrix.join(', ')})`;

        if (hideOverlayTimeout) {
          clearTimeout(hideOverlayTimeout);
          hideOverlayTimeout = undefined;
        }

        if (scannedHash !== lastScannedHash) {
          lastScannedHash = scannedHash;
          onScanStart(scannedHash);
        }
      } else {
        if (!hideOverlayTimeout && lastScannedHash) {          
          const hideOverlay = () => {
            if (overlayRef?.current)
              overlayRef.current.style.opacity = '0';

            lastScannedHash = undefined;
            onScanEnd();        
          }

          hideOverlayTimeout = setTimeout(hideOverlay, 200);
        }
      }

      if (isRunning) {
        requestAnimationFrame(scannerLoop);
      }
    }

    requestAnimationFrame(scannerLoop);
    return () => { isRunning = false };
  }
)