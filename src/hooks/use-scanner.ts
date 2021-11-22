import { useRef, useEffect } from "react";

import useCameraVideo from "./use-camera-video";
import createScannerLoop from "~/utils/scanner-loop";

type UseScannerProps = {
  onReady: () => void;
  onScanStart: (hash: string) => void;
  onScanEnd: () => void;
};

export default (
  function useScanner(props: UseScannerProps) {
    const { onReady } = props;
    const { onScanStart } = props;
    const { onScanEnd } = props;
  
    const overlayRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraVideoRef = useCameraVideo({ onReady });
  
    useEffect(
      function onMount() {
        const stopScannerLoop = createScannerLoop({
          overlayRef,
          canvasRef,
          cameraVideoRef,

          onScanStart,
          onScanEnd,
        });
  
        return () => stopScannerLoop();
      },
  
      [],
    );
  
    return {
      refs: {
        canvas: canvasRef,
        video: overlayRef,
      }
    };
  }  
);
