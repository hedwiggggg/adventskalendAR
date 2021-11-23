import { debounce } from 'throttle-debounce';
import { transform2d } from '~/utils/matrix-operations';

import '~/utils/canvas-extension';

type CreateDrawLoopProps = {
  cameraVideoRef?: React.RefObject<HTMLVideoElement>;
  overlayRef?: React.RefObject<HTMLVideoElement>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onScanStart: (hash: string, overlayVideo: HTMLVideoElement) => void;
}

export default (
  function createScannerLoop(props: CreateDrawLoopProps) {
    const { overlayRef, canvasRef } = props;
    const { cameraVideoRef } = props;

    const { onScanStart } = props;

    let isRunning = true;
    let lastScannedHash: string | undefined;

    const debouncedHideOverlay = debounce(200, () => {
      if (overlayRef?.current)
        overlayRef.current.style.opacity = '0';

      lastScannedHash = undefined;
    });

    async function scannerLoop() {
      const ctx = canvasRef?.current?.getContext('2d');
      const skip = false
        || !overlayRef?.current
        || !canvasRef?.current
        || !cameraVideoRef?.current
        || !ctx;

      if (skip)
        return requestAnimationFrame(scannerLoop);

      const scanRect = ctx.createScanRect(300, 300);

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      overlayRef.current.width = scanRect.width;
      overlayRef.current.height = scanRect.height;

      ctx.drawVideoFrameCoverFit(cameraVideoRef.current);

      const code = await ctx.scanQRCode(scanRect);

      if (code) {
        const matrix = transform2d(
          scanRect.width,
          scanRect.height,

          code.points.a.x, code.points.a.y,
          code.points.b.x, code.points.b.y,
          code.points.c.x, code.points.c.y,
          code.points.d.x, code.points.d.y,
        );

        overlayRef.current.style.opacity = '1';
        overlayRef.current.style.transform = `matrix3d(${matrix.join(', ')})`;

        debouncedHideOverlay();

        if (code.data !== lastScannedHash) {
          lastScannedHash = code.data;
          onScanStart(code.data, overlayRef.current);
        }
      }

      ctx.strokeStyle = "#d4c7d9";
      ctx.lineWidth = 6;

      ctx.beginPath();
      ctx.roundedRect(scanRect, 16);
      ctx.stroke();

      if (isRunning) {
        requestAnimationFrame(scannerLoop);
      }
    }

    requestAnimationFrame(scannerLoop);
    return () => { isRunning = false };
  }
)