import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getThumbnail } from '../mockApi.js';

export default function Preview() {
  const { filename } = useParams();

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadThumbnail() {
      try {
        setLoading(true);
        setError(null);

        const url = await getThumbnail(filename);

        setThumbnailUrl(url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadThumbnail();
  }, [filename]);

  return (
    <div>
      <h1>Preview: {filename}</h1>

      {loading && <p>Loading thumbnail...</p>}
      {error && (<p style={{ color: 'red' }}>Error: {error}</p>)}

      {!loading && !error && (
        <img
          src={thumbnailUrl}
          alt={`Thumbnail for ${filename}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}

      <p>Thumbnail and tuning controls will go here in a future pair program.</p>
      <Link to="/videos" className="text-black-200 hover:text-sky-700">Back to videos</Link>
    </div>
  );
}