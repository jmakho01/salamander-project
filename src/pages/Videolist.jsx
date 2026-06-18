import { useEffect, useState } from "react";
import { getVideos } from "../api.js";
import { Link } from "react-router-dom";

export default function Videolist() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVideos().then((data) => {
      setVideos(data);
      setLoading(false); 
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [] );

  if (loading) {
    return <p>Loading videos...</p>;
  }
    
  if (error) {
    return <p>Could not load videos: {error}</p>;
  }
  
  return (
    <div>
      <h1 className = "text-center text-4xl font-bold">Available Videos</h1>
      <ul>
        {videos.map((filename) => (
          <div className="flex fled-column pt-5 m-5 border-t-2">

            <h2 className="text-center flex-1 font-semibold text-xl m-2">{filename}</h2>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded flex-1 m-2"><Link to={`/preview/${filename}`}>Preview</Link></button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded flex-1 m-2"><Link to={`/playback/${filename}`}>Playback</Link></button>
          </div>

        ))}
      </ul>
    </div>
  );
}