const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dlrxspk2c/image/upload';
const UPLOAD_PRESET = 'dante_portfolio';

const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const uploadToCloudinary = async (file) => {
  const compressedFile = await compressImage(file);
  
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Cloudinary error:', data);
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.secure_url;
};