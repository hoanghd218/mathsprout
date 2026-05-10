// MathSprout — Client-side image helpers for the homework solver.
// Cell-phone photos can be 4-12 MB raw — too big to ship as base64 to the LLM
// API. We downscale to ≤1024px on the longest edge and re-encode as JPEG
// q=0.85 before sending. This keeps each image under ~150 KB while staying
// readable for vision models.

const MAX_EDGE = 1024;
const JPEG_QUALITY = 0.85;
// Reject files larger than this BEFORE decoding to avoid OOM on old phones.
export const MAX_RAW_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Read a File/Blob and return a downscaled JPEG data URL.
 * Throws on non-image files or oversized originals.
 *
 * @param {File|Blob} file
 * @returns {Promise<string>} data URL like "data:image/jpeg;base64,..."
 */
export async function compressImage(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    throw new Error('Only image files are supported.');
  }
  if (file.size > MAX_RAW_BYTES) {
    throw new Error('Image is too large. Please choose a smaller photo.');
  }

  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_EDGE);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot create canvas 2d context.');
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

/**
 * Read a File/Blob into a data URL (no compression). Used internally + for
 * preview rendering in the UI before compression completes.
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image.'));
    img.src = src;
  });
}

function fitWithin(w, h, maxEdge) {
  if (w <= maxEdge && h <= maxEdge) return { width: w, height: h };
  const scale = w >= h ? maxEdge / w : maxEdge / h;
  return {
    width: Math.round(w * scale),
    height: Math.round(h * scale)
  };
}
