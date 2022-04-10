import React from "react";

export const ServicesSelect = ({services, setPhotos, photos}) => {
  const handleChangeOption = (e) => {
    if (!e.target.value) setPhotos(photos);

    // if (e.target.value) {
    // const filter = photos?.filter((item) => item.id === e.target.value);
    // setPhotos(filter as any);
    // }
  };

  console.log(services, 'services')
  return (
    <div className="person-gallery-select-box">
      <select className="person-gallery-select person-arrows" defaultValue='All Services' onChange={handleChangeOption}>
        <option value="">All Services</option>
        {services.map((service) => (
          <option value={service.id} key={service.id}>
            {service.service_name}
          </option>))}
      </select>
    </div>
  )
}
