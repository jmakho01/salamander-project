import { Link, useParams } from 'react-router-dom';
import { getThumbnail } from '../api.js';
import { useEffect, useState } from 'react';

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

  return (
    <div>
      <h1>Preview: {filename}</h1>
      <img alt={filename} src={imgSrc}></img>
      <p>Thumbnail and tuning controls will go here in a future pair program.</p>
      <Link to="/videos" className="text-black-200 hover:text-sky-700">Back to videos</Link>
    </div>
  );
}