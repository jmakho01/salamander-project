import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getThumbnail } from '../api.js';

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export default function Preview() {
  const { filename } = useParams();
  const [imgSrc, setimgSrc] = useState(null)
  const [status, setStatus] = useState("idle") 
  const [error, setError] = useState(null)


  useEffect(() => {
    fetch(getThumbnail(filename))
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => setimgSrc(data))
      .catch(err => {
        setError(err.message)
        setStatus("error")
      })
  })

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [color, setColor] = useState('#000000');
  const [tolerance, setTolerance] = useState(50);
  const [imageReady, setImageReady] = useState(false);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    async function loadThumbnail() {
      try {
        setLoading(true);
        setError(null);
        const url = await getThumbnail(filename);
        setThumbnailUrl(url);
      } 
      catch(err) { setError(err.message); }
      finally { setLoading(false); }
    }
    loadThumbnail();
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

    for (let i = 0; i < px.length; i += 4) {
      const red = px[i];
      const green = px[i + 1];
      const blue = px[i + 2];

      const dr = red - target.r;
      const dg = green - target.g;
      const db = blue - target.b;

      const distance = Math.sqrt(dr * dr + dg * dg + db * db);

      if(distance < tolerance) {
        px[i] = 255;
        px[i + 1] = 255;
        px[i + 2] = 255;
      } else {
        px[i] = 0;
        px[i + 1] = 0;
        px[i + 2] = 0;
      }
    }
    ctx.putImageData(data, 0, 0);
  }, [imageReady, color, tolerance]);

  return (
    <div>
      <h1>Preview: {filename}</h1>
<<<<<<< HEAD
      <img alt={filename} src={imgSrc}></img>
      <p>Thumbnail and tuning controls will go here in a future pair program.</p>
=======

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
>>>>>>> 07913574112df44b884612566a08e5c0ab0d418c
      <Link to="/videos" className="text-black-200 hover:text-sky-700">Back to videos</Link>
    </div>
  );
}