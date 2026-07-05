/**
 * Losslessly compress an image File in the browser using the Canvas API.
 * - PNG: re-encoded at full quality (lossless)
 * - JPEG/WebP: re-encoded at 98% quality (near-lossless, much smaller)
 * - Caps maximum dimension at 2400px to prevent absurdly large uploads
 *   while keeping the image sharp and detailed on the catalogue.
 *
 * @param file - the original image File
 * @returns compressed File
 */
export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file); // not an image, return unchanged
      return;
    }

    const MAX_DIMENSION = 2400;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Maintain aspect ratio
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const isPng = file.type === 'image/png';
      // PNG → keep as PNG lossless; others → WebP at near-lossless quality
      const outputMime = isPng ? 'image/png' : 'image/webp';
      const quality = isPng ? 1.0 : 0.98; // 0.98 = near-lossless for WebP

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; } // fallback if conversion fails
          const compressed = new File([blob], file.name.replace(/\.\w+$/, isPng ? '.png' : '.webp'), {
            type: outputMime,
            lastModified: Date.now(),
          });
          // Only use compressed if it's actually smaller
          resolve(compressed.size < file.size ? compressed : file);
        },
        outputMime,
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
  });
}
