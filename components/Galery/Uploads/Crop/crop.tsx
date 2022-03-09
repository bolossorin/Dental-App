import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";

interface CropProps {
  src: string;
  onSave: (src: string) => void;
  onCancel: () => void;
  disableEdit: boolean;
}

export const Crop: React.FC<CropProps> = ({
  src,
  onSave,
  disableEdit,
  onCancel,
}) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 25, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [savedImg, setSavedImg] = useState("");
  const [step, setStep] = useState<"save" | "edit">("edit");

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

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

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  const generateDownload = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
        setSavedImg(previewUrl);
        onSave(previewUrl);
      },
      "image/png",
      1
    );
  };

  return (
    <>
      {step === "edit" && (
        <>
          <ReactCrop
            src={src}
            onImageLoaded={onLoad}
            crop={crop as any}
            onChange={(c) => setCrop(c as any)}
            onComplete={(c) => setCompletedCrop(c as any)}
          />
          <div>
            <canvas
              ref={previewCanvasRef}
              // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
              style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div className="form-login-buttons">
              <button
                className="button-green"
                type="button"
                disabled={!completedCrop?.width || !completedCrop?.height}
                onClick={() => {
                  generateDownload(previewCanvasRef.current, completedCrop);
                  setStep("save");
                }}
              >
                Save
              </button>
            </div>
            <div className="form-login-buttons">
              <button className="button-green" type="button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {step === "save" && (
        <>
          <div>
            <img src={savedImg} alt="" />
          </div>
          {!disableEdit && (
            <>
              <div className="form-login-buttons">
                <button
                  className="button-green"
                  type="button"
                  onClick={() => {
                    setStep("edit");
                  }}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
