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
    console.log("hi")
  } );

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
          <div className="flex fled-column">
          <h2>{filename}</h2>
          <li key = {filename} className="my-4">
            <Link to={`/preview/${filename}`} className="text-black-200 m-22 hover:text-sky-700 btn btn-blue"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded">Preview</button></Link>
            <Link to={`/playback/${filename}`} className="text-black-200 hover:text-sky-700"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded">Playback</button></Link>
          </li>
          </div>
        ))}
      </ul>
    </div>
  );
}