import React, {useContext, useEffect, useState} from "react";

//libs
import QRCode from "qrcode";
import SimpleImageSlider from "react-image-gallery";
import Link from "next/link";

// components
import {IUserGallery} from "../../reducers/types";
import {ServicesSelect} from "../common/ServicesSelect/ServicesSelect";
import {AppContext} from "../../context/app.context";

interface IPersonProps {
  gallery: IUserGallery[];
}

const Person: React.FC<IPersonProps> = ({gallery}) => {
  const {state} = useContext(AppContext);
  const {
    services,
    locations,
    avatarUrl,
    email,
    phone,
    title,
    dentist_name,
    subscription_plan,
    qualifications,
    gdc,
    bio,
    website
  } = state.dentistState;

  const [filteredGallery, setFilteredGallery] = useState<IUserGallery[]>([]);

  useEffect(() => {
    setFilteredGallery(gallery)
  }, [gallery]);

  useEffect(() => {
    const canvas: any = document.getElementById("canvasQrcode");
    void QRCode.toCanvas(canvas, window.location.href);
  }, []);

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
        <div className="person-index-leftmenu-profile-information">
          <img className="profile-photo" src={avatarUrl || "../images/empty_avatar.png"} alt="/" />
          <div className='person-index-leftmenu-section'>
            <div className="person-form-login-title">
              <p>{title}</p>
              <p>{dentist_name}</p>
              {subscription_plan === "PREMIUM" && (<img
                className="person-index-gallery-image-watermark-img person-relative-img"
                src={"../images/check_circle.svg"}
                alt="check" />)}
            </div>
            <p className="person-form-login-subtitle">
              Qualifications: {qualifications ? qualifications : '-'}
            </p>
            <p className="person-form-login-subtitle">GDC No: {gdc}</p>
          </div>
          <div className="person-index-leftmenu-text">
            <p className='person-index-leftmenu-title'>Bio</p>
            <p>{bio ? bio : '-'}</p>
            <div className="person-button-list">
              {services.map((item, index) =>
                <button key={index} className="person-index-green-button">
                  {item.service_name}
                </button>)}
            </div>
            <p className='person-index-leftmenu-title'>Contact</p>
            <div className='person-index-leftmenu-section'>
              <p>
                <strong>Phone: </strong>{phone ? phone : '-'}
              </p>
              <p>
                <strong>Email: </strong>{email ? email : '-'}
              </p>
              <Link href={`https://${website}`}>
                <a target="_blank" className='person-index-leftmenu-title'>
                  <span><strong>Website:</strong> {website ? website : '-'}</span>
                </a>
              </Link>
            </div>
            <div className='person-index-leftmenu-section'>
              <p className='person-index-leftmenu-title'>Locations</p>
              <div className='person-index-leftmenu-value'>
                {(locations && locations.length > 0) ? locations.map((item, index) =>
                  <div key={index}>
                  <span>
                    <strong>{item.location_name}:</strong> {item.address}, {item.post_code}
                  </span>
                  </div>) : '-'}
              </div>
            </div>
            <p className='person-index-leftmenu-title'>QR Code:</p>
            <div title='Download' className="qrCode person-index-leftmenu-value" onClick={downloadQRCode}>
              <canvas id="canvasQrcode" />
              <a id="link" />
            </div>
          </div>
        </div>
      </div>
      <div className="person-index-box-to-box">
        <div className="person-main-index person-index-main-box person-relative">
          <ServicesSelect setFilteredGallery={setFilteredGallery} services={services} gallery={gallery} />
          {filteredGallery && filteredGallery.length > 0 ?
            <div className="person-index-dentist-gallery-box">
              {filteredGallery.map((photo, index) => (
                photo.after && <div className="person-index-dentist-gallery-image-box" key={index}>
                  <SimpleImageSlider
                    showThumbnails={false}
                    showPlayButton={false}
                    showBullets={true}
                    showNav={false}
                    items={[
                      {original: photo.before.water_marked_url ? photo.before.water_marked_url.replace('http', 'https') : photo.before.url.replace('http', 'https')},
                      {original: photo.after.water_marked_url ? photo.after.water_marked_url.replace('http', 'https') : photo.after.url.replace('http', 'https')}
                    ]} />
                </div>))}
            </div> : <h2 className='empty'>Not found</h2>}
        </div>
      </div>
    </main>
  );
};

export default Person;
