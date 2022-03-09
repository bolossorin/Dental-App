import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app.context";
import { IUserGallery } from "../../reducers/types";
import SimpleImageSlider from "react-image-gallery";
import QRCode from "qrcode";
import { IDentistFullDataResponse } from "..";
import { useGetDentist } from "../../hooks/useGetDentist";
import { ISetNotofication } from "../Toast";
import notify from "../Toast";

interface IPersonProps {
  dentist: IDentistFullDataResponse;
  galleryData: IUserGallery[];
}

const Person: React.FC<IPersonProps> = ({ dentist, galleryData }) => {
  const {
    accountType,
    avatar_url,
    cover_url,
    email,
    gallery,
    gdcNumber,
    locations,
    phone,
    profileBio,
    qualifications,
    services,
    title,
    username,
    website,
  } = useGetDentist(dentist, galleryData);

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const [photos, setPhotos] = useState<IUserGallery[] | null | undefined>(
    gallery || null
  );

  useEffect(() => {
    const canvas: any = document.getElementById("canvasQrcode");
    void QRCode.toCanvas(canvas, window.location.href);
  }, []);

  const handleChangeOption = (e) => {
    const selectedService = e.target.value;
    if (!selectedService) {
      setPhotos(gallery);
    }
    if (selectedService) {
      const filter = gallery?.filter(
        (item) => item.service_id === selectedService
      );
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
    <>
      <section>
        <div className="person-flex-menu">
          <div className="person-index-leftmenu">
            <img
              className="person-leftmenu-index-cover-image"
              src={
                accountType === "free" ? "../images/empty.png" : cover_url || ""
              }
              alt="cover image"
            />
            <div className="person-index-leftmenu-profile-information">
              <img
                className="person-index-leftmenu-profile-photo"
                src={avatar_url || "../images/empty_avatar.png"}
                alt="/"
              />
              <div>
                <div className="person-form-login-title">
                  {title + " " + username}
                  {accountType !== "free" && (
                    <img
                      className="person-index-gallery-image-watermark-img person-relative-img"
                      src="../images/check_circle.svg"
                      alt="check"
                    />
                  )}
                </div>
                <p className="person-form-login-subtitle">
                  Qualifications: {qualifications}
                </p>
                <p className="person-form-login-subtitle">
                  GDC No: {gdcNumber}
                </p>
              </div>
              <div className="person-index-leftmenu-text">
                <p>Bio: </p>
                <p>{profileBio}</p>
                <div className="person-button-list">
                  {services?.map((item) => {
                    return (
                      <button
                        className="person-index-green-button"
                        key={item.service_id}
                      >
                        {item.service_name}
                      </button>
                    );
                  })}
                </div>
                <p>Contact: </p>
                <div>
                  <span>
                    <strong>Phone:</strong> {phone}{" "}
                  </span>
                  <br />
                  <span>
                    <strong>Email:</strong> {email}{" "}
                  </span>
                  <br />
                  <a href={`../../redirect/www.${website}`} target="_blank">
                    <span>
                      {" "}
                      <strong>Website:</strong> {website}{" "}
                    </span>
                  </a>
                </div>
                <p>Locations:</p>
                <div>
                  {locations?.map((item) => {
                    const city = item.location.split(":")[0];
                    const adress = item.location.split(":")[1];
                    return (
                      <div key={item.key}>
                        <span>
                          <strong>{city}:</strong>
                          {adress}
                        </span>
                        <br />
                      </div>
                    );
                  })}
                </div>
                <p>QR Code:</p>
                <div className="qrCode" onClick={downloadQRCode}>
                  <canvas id="canvasQrcode" />
                  <a id="link"></a>
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
                  onChange={handleChangeOption}
                >
                  <option value="" selected>
                    Service
                  </option>
                  {services &&
                    services.map((service) => (
                      <option value={service.service_id} key={service.key}>
                        {service.service_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="person-index-dentist-gallery-box ">
                {photos &&
                  photos.map((item) => (
                    <div
                      className="person-index-dentist-gallery-image-box"
                      key={item.key}
                    >
                      <SimpleImageSlider
                        // width={247}
                        // heigth={247}
                        showThumbnails={false}
                        showPlayButton={false}
                        showBullets={true}
                        showNav={false}
                        items={[
                          { original: item.imageAfterUrl },
                          { original: item.imageBeforeUrl },
                        ]}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Person;
