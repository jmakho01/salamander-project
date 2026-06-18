export async function getVideos() {
  const res = await fetch('/api/videos');
  if (!res.ok) {
    throw new Error(`Server responded ${res.status}`);
  }
  return res.json();
}

export async function getThumbnail(filename) {
  const url = `/thumbnail/${filename}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No thumbnail for ${filename}`);
  }
  return url;
}

export async function submitProcessingJob(filename, targetColor, threshold) {
  // The contract wants the hex with no leading '#'.
  const hex = targetColor.replace('#', '');
  const res = await fetch(
    `/process/${filename}?targetColor=${hex}&threshold=${threshold}`,
    { method: 'POST' }
  );
  if (!res.ok) {
    throw new Error(`Server responded ${res.status}`);
  }
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(`/process/status/${jobId}`);
  if (!res.ok) {
    throw new Error(`Server responded ${res.status}`);
  }
  return res.json();
}

export async function getVideoPreview(filename){
  const url = `/preview/${filename}`;
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const res = await fetch(url);
  if (!res.ok){
    throw new Error(`No video for ${filename}`);
  }
  return `${base}${url}`;
}

export const getResults = async (filename) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/results/${filename}`);
  if (!res.ok) throw new Error('Failed to fetch results');
  return res.json();
};