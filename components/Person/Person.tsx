import React, {useEffect, useState} from "react";

//libs
import QRCode from "qrcode";
import SimpleImageSlider from "react-image-gallery";
import Link from "next/link";

// components
import {IService, IUserGallery} from "../../reducers/types";
import {IDentistFullDataResponse} from "..";

interface IPersonProps {
  dentist: IDentistFullDataResponse;
  gallery: IUserGallery[];
  allServices: IService[];
}

const Person: React.FC<IPersonProps> = ({dentist, gallery, allServices}) => {

  const [photos, setPhotos] = useState<IUserGallery[] | null | undefined>(gallery || null);

  useEffect(() => {
    const canvas: any = document.getElementById("canvasQrcode");
    void QRCode.toCanvas(canvas, window.location.href);
  }, []);

  const handleChangeOption = (e) => {
    const selectedService = e.target.value;
    if (!selectedService) setPhotos(gallery);

    if (selectedService) {
      const filter = gallery?.filter((item) => item.id === selectedService);
      setPhotos(filter as any);
    }
  };

  const downloadQRCode = () => {
    const canvas: any = document.getElementById("canvasQrcode");
    const link: any = document.getElementById("link");
    link.setAttribute("download", "QrCode.png");
    link.setAttribute(
      "href",
      canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    );
    link.click();
  };

  return (
    <main className="person-flex-menu">
      <div className="person-index-leftmenu">
        <img
          className="cover-image"
          src={dentist.subscription_plan !== "PREMIUM" ? "../images/cover-image.jpg" : dentist.cover_url || "../images/cover-image.jpg"}
          alt="cover image" />
        <div className="person-index-leftmenu-profile-information">
          <img className="profile-photo" src={dentist.avatarUrl || "../images/empty_avatar.png"} alt="/" />
          <div>
            <div className="person-form-login-title">
              {dentist.title} <br />
              {dentist.dentist_name}
              {dentist.subscription_plan === "PREMIUM" && (<img
                className="person-index-gallery-image-watermark-img person-relative-img"
                src={"../images/check_circle.svg"}
                alt="check" />)}
            </div>
            <p className="person-form-login-subtitle">Qualifications: {dentist.qualifications}</p>
            <p className="person-form-login-subtitle">GDC No: {dentist.gdc}</p>
          </div>
          <div className="person-index-leftmenu-text">
            <p>Bio: </p>
            <p>{dentist.bio}</p>
            <div className="person-button-list">
              {dentist.services?.map((item, index) =>
                <button className="person-index-green-button" key={index}>
                  {item.service_name}
                </button>)}
            </div>
            <p>Contact:</p>
            <div>
              <span><strong>Phone:</strong> {dentist.phone}</span>
              <br />
              <span><strong>Email:</strong> {dentist.email}</span>
              <br />
              <Link href={`https://${dentist.website}`}>
                <a target="_blank">
                  <span><strong>Website:</strong> {dentist.website}</span>
                </a>
              </Link>
            </div>
            <p>Locations:</p>
            <div>
              {dentist.locations?.map((item, index) =>
                <div key={index}>
                  <span>
                    {/*<strong>{item.location.split(":")[0]}:</strong>*/}
                    {/*{item.location.split(":")[1]}*/}
                  </span>
                  <br />
                </div>)}
            </div>
            <p>QR Code:</p>
            <div title='Download' className="qrCode" onClick={downloadQRCode}>
              <canvas id="canvasQrcode" />
              <a id="link" />
            </div>
          </div>
        </div>
      </div>
      <div className="person-index-box-to-box">
        <div className="person-main-index person-index-main-box person-relative">
          <div className="person-gallery-select-box">
            <select
              className="person-gallery-select person-arrows"
              name="services"
              id="services"
              defaultValue='service'
              onChange={handleChangeOption}>
              <option value="">Dentist Services</option>
              {allServices.map((service) => (
                <option value={service.id} key={service.id}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>
          {photos && photos.length > 0 ?
            <div className="person-index-dentist-gallery-box">
              {photos.map((item, index) => (
                <div className="person-index-dentist-gallery-image-box" key={index}>
                  <SimpleImageSlider
                    showThumbnails={false}
                    showPlayButton={false}
                    showBullets={true}
                    showNav={false}
                    items={[
                      {original: item.imageAfterUrl},
                      {original: item.imageBeforeUrl},
                    ]} />
                </div>))}
            </div> : <h2 className='empty'>Not found</h2>}
        </div>
      </div>
    </main>
  );
};

export default Person;
