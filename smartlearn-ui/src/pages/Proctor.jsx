import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function Proctor() {
  const videoRef = useRef();
  const [status, setStatus] = useState("Initializing camera...");
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);

  useEffect(() => {
    const init = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStatus("Camera ready. Capture reference photo before exam.");

      const tick = setInterval(async () => {
        if (!videoRef.current.paused && !videoRef.current.ended) {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (!detection) {
            setStatus("Face not detected. Please center your face and increase lighting.");
            return;
          }
          if (!referenceDescriptor) {
            setStatus("Reference not set. Click capture.");
            return;
          }
          const distance = faceapi.euclideanDistance(referenceDescriptor, detection.descriptor);
          setStatus(distance < 0.6 ? "Face matched - proctoring OK" : `Face mismatch (${distance.toFixed(2)})`);
        }
      }, 1000);

      return () => clearInterval(tick);
    };

    init().catch((err) => setStatus("Camera init error: " + err.message));
  }, [referenceDescriptor]);

  const captureReference = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!detection) {
      setStatus("Capture failed: face not detected. Reposition camera.");
      return;
    }
    setReferenceDescriptor(detection.descriptor);
    setStatus("Reference captured. Monitoring in progress.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Proctoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-auto border rounded-lg" />
        </div>
        <div>
          <p className="mb-3">{status}</p>
          <button className="px-4 py-2 bg-orange-500 text-white rounded" onClick={captureReference}>
            Capture Reference Face
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Keep camera on and visible during the entire exam. Don’t switch tabs or hide window.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Proctor;