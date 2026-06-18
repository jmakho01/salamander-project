import { getThumbnail, getVideoPreview } from './api.js';

export async function loadThumbnail(filename, { setLoading, setError, setThumbnailUrl }) {
      try {
        setLoading(true);
        setError(null);
        const url = await getThumbnail(filename);
        setThumbnailUrl(url);
      } 
      catch(err) { setError(err.message); }
      finally { setLoading(false); }
}

export async function loadVideoPreview(filename, { setLoading, setError, setVideoUrl}){
      try {
        setLoading(true);
        setError(null);
        const url = await getVideoPreview(filename);
        setVideoUrl(url);
      }
      catch(err){ setError(err.message); }
      finally { setLoading(false); }
}

export default { loadThumbnail, loadVideoPreview };