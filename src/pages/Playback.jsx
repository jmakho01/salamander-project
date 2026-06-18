import { getThumbnail } from '../api.js';
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import {loadThumbnail, loadVideoPreview} from '../globalFunctions.js';

export default function Playback( video ) {
    const { filename } = useParams();
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadThumbnail(filename, {setLoading, setError, setThumbnailUrl});
        loadVideoPreview(filename, {setLoading, setError, setVideoUrl});
      }, [filename]);

    return <>
    <h1>{filename}</h1>
        <video className="m-auto" max-width="1280" max-height="720" controls src={videoUrl}></video>
    </>
}