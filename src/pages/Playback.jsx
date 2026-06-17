import { getThumbnail } from '../api.js';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import loadThumbnail from '../globalFunctions.js';

export default function Playback( video ) {
    const { filename } = useParams();
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadThumbnail(filename, {setLoading, setError, setThumbnailUrl});
      }, [filename]);

    return <>
    <h1>{filename}</h1>
        <video width="320" height="240" controls>
        <source src="movie.mp4" type="video/mp4"></source>
        <source src="movie.ogg" type="video/ogg"></source>
        Your browser does not support the video tag.
        </video>
    </>
}