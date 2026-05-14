import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Videolist from './pages/Videolist.jsx';
import Preview from './pages/Preview.jsx';

export default function App() {
  return (
    <div>
      <nav>
          <Link to="/">Home</Link>
          {' | '}
          <Link to="/videos">Videos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videolist />} />
        <Route path="/preview/:filename" element={<Preview />} />
      </Routes>
    </div>
  );
} 