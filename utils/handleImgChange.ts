// components
import {dataURLtoFile, toDataURL} from "./toBase64";
import {resizeFile} from "./resizer";

export const handleImgChange = async (e, setNotification, setImgUpload) => {

  const file = e.target.files && e.target.files[0];
  const fileSize = file!.size / (1024 * 1024);
  if (fileSize <= 2) {
    setImgUpload(file as any);
  } else {
    setNotification({type: "warning", message: "Please  upload file size no bigger than 2 mb"});
  }
};


export const getSrcImage = async (file) => {
  if (typeof file.name !== 'string') {
    let newFile;
    const dataUrl = await toDataURL(file);
    newFile = dataURLtoFile(dataUrl, "gallery.jpg");
    return await resizeFile(newFile)
  } else {
    return await resizeFile(file)
  }
}
