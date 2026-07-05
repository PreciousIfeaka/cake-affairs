import axios from 'axios';
import { getCloudinarySignature } from '../services/api';

export async function uploadDirectToCloudinary(
  file: File,
  folder: string = 'cake-affairs'
): Promise<{ url: string; public_id: string; is_video: boolean }> {
  // 1. Get signature from backend
  const sigRes = await getCloudinarySignature(folder);
  const { signature, timestamp, apiKey, cloudName } = sigRes.data;

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';

  // 3. Send upload request directly to Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const res = await axios.post(uploadUrl, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return {
    url: res.data.secure_url,
    public_id: res.data.public_id,
    is_video: isVideo
  };
}
