import React from "react";

export const ServicesSelect = ({services, setFilteredGallery, gallery}) => {
  const handleChangeOption = (e) => {
    if (!e.target.value) setFilteredGallery(gallery);

    if (e.target.value) {
      const filter = gallery.filter((item) => item.dentist_service_id === e.target.value);
      setFilteredGallery(filter as any);
    }
  };

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
