import { useRef, useEffect } from "react";

import useCameraVideo from "./use-camera-video";
import createScannerLoop from "~/utils/scanner-loop";

type UseScannerProps = {
  onScanStart: (hash: string, overlayVideo: HTMLVideoElement) => void;
};

export default (
  function useScanner(props: UseScannerProps) {
    const { onScanStart } = props;
  
    const overlayRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraVideoRef = useCameraVideo({ onReady: () => {} });
  
    useEffect(
      function onMount() {
        const stopScannerLoop = createScannerLoop({
          overlayRef,
          canvasRef,
          cameraVideoRef,
          onScanStart,
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
