/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadThumbnail } from '../globalFunctions.js';
import { findLargestGroupCentroid } from '../connectedComponents.js';
import {getJobStatus, getResults} from "../api.js";

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export default function Preview() {
  const { filename } = useParams();

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [color, setColor] = useState('#000000');
  const [tolerance, setTolerance] = useState(50);
  const [debouncedTolerance, setDebouncedTolerance] = useState(50);
  const [imageReady, setImageReady] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [result, setResult] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null)

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    loadThumbnail(filename, {setLoading, setError, setThumbnailUrl});
  }, [filename]);

  useEffect(() => {
    if(!thumbnailUrl) return;
    //setImageReady(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImageReady(true);
    };
    img.src = thumbnailUrl;
  }, [thumbnailUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTolerance(tolerance);
    }, 100);

    return () => clearTimeout(timer);
  }, [tolerance]);

  useEffect(() => {
    if(!imageReady) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    if(!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const px = data.data;
    const target = hexToRgb(color);

    const binaryImage = Array.from(
      { length: canvas.height },
      () => Array(canvas.width).fill(0)
    );

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;

        const red = px[i];
        const green = px[i + 1];
        const blue = px[i + 2];

        const dr = red - target.r;
        const dg = green - target.g;
        const db = blue - target.b;

        const distance = Math.sqrt(dr * dr + dg * dg + db * db);

        if (distance < debouncedTolerance) {
          binaryImage[y][x] = 1;
          px[i] = 255;
          px[i + 1] = 255;
          px[i + 2] = 255;
        } else {
          binaryImage[y][x] = 0;
          px[i] = 0;
          px[i + 1] = 0;
          px[i + 2] = 0;
        }
      }
    }

    ctx.putImageData(data, 0, 0);

    const centroid = findLargestGroupCentroid(binaryImage);

    if (centroid) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, 15, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [imageReady, color, debouncedTolerance]);

  useEffect(() => {
  if (!jobId) return;

  const id = setInterval(async () => {
    try {
      const status = await getJobStatus(jobId);
      setIsSubmitting(true);

      if (status.status === 'processing') {
        // still running, keep polling
        return;
      }

      if (status.status === 'done') {
        setResult(true);
        setIsSubmitting(false)
        console.log(result)
        clearInterval(id);
      }

      if (status.status === 'error') {
        setError(status.error);
        setIsSubmitting(false)
        clearInterval(id);
      }

    } catch (err) {
      setError(err.message);
      setIsSubmitting(false)
      clearInterval(id);
    }
  }, 1500);

  return () => clearInterval(id);
}, [jobId]);

useEffect(() => {
  if(!result) return;

  setDownloadUrl(`http://localhost:3000/results/${filename}.csv/download`);

}, [result])


  const handleProcessVideo = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const targetColor = color.replace('#', '');
      const response = await fetch(
        `http://localhost:3000/process/${filename}?targetColor=${targetColor}&threshold=${tolerance}`,
        { method: 'POST', }
    );

    if (!response.ok) throw new Error('Failed to start processing');

    const data = await response.json();

    setJobId(data.jobId);

    console.log('Job started:', data.jobId);
    } catch (err) { setSubmitError(err.message);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div>
      <h1>Preview: {filename}</h1>

      {loading && <p>Loading thumbnail...</p>}
      {error && (<p className="text-red-500">Error: {error}</p>)}

      {!loading && !error && (
        <>
          <div className="flex items-start justify-center gap-5 mb-5 w-full">
            <img 
              src={thumbnailUrl}
              alt={`Thumbnail for ${filename}`}
              className="flex-1 w-full min-w-0 max-w-[400px] h-auto object-contain"
            />

            <canvas 
              ref={canvasRef} 
              className="flex-1 w-full min-w-0 max-w-[400px] h-auto object-contain border border-black"
            />
          </div>

          <div className="mb-4">
            <label>
              Target Color:{' '}
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                }}
              />
            </label>
          </div>

          <div className="mb-5">
            <label>
              Tolerance:{' '}
              <input
                type="range"
                min="0"
                max="442"
                value={tolerance}
                onChange={(e) => {
                  setTolerance(Number(e.target.value));
                }}
              />
              {' '}
              {tolerance}
            </label>
          </div>
        </>
      )}
      <button
        onClick={handleProcessVideo}
        disabled={isSubmitting}
        className={`px-4 py-2 rounded ${
        isSubmitting || loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
      >
      {isSubmitting ? 'Processing' : 'Process Video with These Settings'}
      </button>
      {submitError && ( <p className="text-red-500 mt-2">{submitError}</p>)}
      <br></br>
      {downloadUrl && (
        <button className="bg-blue-500 text-white hover:bg-blue-600 m-2 p-3 rounded">
        <a href={downloadUrl} download>
          Download CSV
        </a>
        </button>
      )}
      <br></br>
      <Link to="/videos" className="text-black-200 hover:text-sky-700">Back to videos</Link>
    </div>
  );
}