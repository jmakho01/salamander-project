import { getThumbnail } from './api.js';

export default async function loadThumbnail(filename, { setLoading, setError, setThumbnailUrl }) {
      try {
        setLoading(true);
        setError(null);
        const url = await getThumbnail(filename);
        setThumbnailUrl(url);
      } 
      catch(err) { setError(err.message); }
      finally { setLoading(false); }
}
