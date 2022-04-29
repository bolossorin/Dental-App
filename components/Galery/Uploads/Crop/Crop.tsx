import React, {useState, useCallback, useRef, useEffect} from "react";

// libs
import ReactCrop from "react-image-crop";
import {dataURLtoFile, toDataURL} from "../../../../utils/toBase64";
import {Spinner} from "../../../Spinner/Spinner";

interface CropProps {
  aspect: number;
  getSrcImage: any;
  onSubmitButton: boolean;
  isSubmitting: boolean;
  setImgUpload: (src: null) => void;
  setImg: (src: File | null) => void;
}

export const Crop: React.FC<CropProps> = (
  {
    getSrcImage,
    setImgUpload,
    onSubmitButton,
    setImg,
    isSubmitting,
    aspect
  }) => {

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState<any>({unit: "%", width: 25, height: 25, aspect: 1});
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [savedImg, setSavedImg] = useState("");
  const [step, setStep] = useState<"save" | "edit">("edit");
  const [src, setSrc] = useState<string>("");

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  getSrcImage.then((data) => setSrc(data));

  useEffect(() => {
    if (aspect) {
      setCrop({unit: "%", width: 25, aspect: aspect})
    }
  }, [aspect]);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) return;

    const image: any = imgRef.current;
    const canvas: any = previewCanvasRef.current;
    const crop: any = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width * scaleX, crop.height * scaleY);
  }, [completedCrop]);

  const generateDownload = (canvas, crop) => {
    setStep("save");
    if (!crop || !canvas) return;

    canvas.toBlob((blob) => {
      const previewUrl = window.URL.createObjectURL(blob);
      setSavedImg(previewUrl);

      toDataURL(previewUrl)
        .then(dataUrl => setImg(dataURLtoFile(dataUrl, "gallery.jpg")))
    }, "image/png", 1);

  };

  return (
    <>
      {step === "edit" && (<>
        <ReactCrop
          src={src}
          onImageLoaded={onLoad}
          crop={crop as any}
          onChange={(c) => setCrop(c as any)}
          onComplete={(c) => setCompletedCrop(c as any)} />
        <div className='canvas-wrapper'>
          <canvas
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{width: Math.round(completedCrop?.width ?? 0), height: Math.round(completedCrop?.height ?? 0)}} />
        </div>
        <div style={{display: "flex"}}>
          <div className="form-login-buttons">
            <button
              className="button-green"
              type="button"
              disabled={!completedCrop?.width || !completedCrop?.height}
              onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}>
              Crop
            </button>
          </div>
          <div className="form-login-buttons">
            <button className="button-green" type="button" onClick={() => {
              setImg(null);
              setImgUpload(null);
            }}>
              Cancel
            </button>
          </div>
        </div>
      </>)}
      {step === "save" && (<div className="form-login-buttons ai-fs">
        <img className='cropped-image' src={savedImg} alt="" />
        <div style={{display: "flex"}}>
          <div className="form-login-buttons">
            <button className="button-green" type="button" onClick={() => setStep("edit")} disabled={isSubmitting}>
              Edit
            </button>
          </div>
          {onSubmitButton && <div className="form-login-buttons">
            <button className="button-green" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Save"}
            </button>
          </div>}
        </div>
      </div>)}
    </>
  );
};
