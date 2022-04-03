import Resizer from "react-image-file-resizer";

export const resizeFile = (file, maxW?: number, maxH?: number, quality?: number, outputType: string = 'base64') =>
new Promise((resolve) => {
  Resizer.imageFileResizer(
    file,
    maxW || 1080,
    maxH || 1080,
    "JPEG",
    quality || 90,
    0,
    (uri) => resolve(uri),
    outputType
  );
});
