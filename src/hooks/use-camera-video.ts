import { useEffect, useRef } from "react";

type UseCameraVideoProps = {
  onReady: () => void;
};

export default (
  function useCameraVideo(props: UseCameraVideoProps) {
    const { onReady } = props;
    const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  
    useEffect(
      function getCamera() {
        async function getStream(constraints: MediaStreamConstraints) {
          const video = document.createElement("video");
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
          video.srcObject = stream;
          video.play();
  
          cameraVideoRef.current = video;
          onReady();
        }
  
        getStream({
          audio: false,
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
        });
      },
  
      [],
    );
  
    return cameraVideoRef;
  }  
)