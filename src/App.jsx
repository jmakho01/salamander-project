import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Videolist from './pages/Videolist.jsx';
import Preview from './pages/Preview.jsx';
import Playback from './pages/Playback.jsx';

export default function App() {
  return (
    <div className="mx-auto flex-row text-center max-w-4xl items-center gap-x-4 rounded-xl bg-white p-8 shadow-lg outline outline-black/5 dark:bg-slate-200 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      <nav>
          <Link to="/" className="text-black-200 hover:text-sky-700">Home</Link>
          {' | '}
          <Link to="/videos" className="text-black-200 hover:text-sky-700">Videos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videolist />} />
        <Route path="/preview/:filename" element={<Preview />} />
        <Route path="/playback/:filename" element={<Playback />} />
      </Routes>
    </div>
  );
} 