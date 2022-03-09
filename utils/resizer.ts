import Resizer from "react-image-file-resizer";
export const resizeFile = (
  file,
  maxW?: number,
  maxH?: number,
  qulality?: number
) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxW || 1080,
      maxH || 1080,
      "JPEG",
      qulality || 90,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
