export const getImageSrc = (base64: string) => {
  try {
    const decoded = atob(base64);
    if (decoded.startsWith('\x89PNG')) {
      return `data:image/png;base64,${base64}`;
    } else if (decoded.startsWith('\xFF\xD8')) {
      return `data:image/jpeg;base64,${base64}`;
    }
  } catch {
    return '';
  }
  return '';
};
