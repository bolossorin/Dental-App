import React from 'react';

interface IMeMarker {
  lat: number;
  lng: number;
}

export const MeMarker: React.FC<IMeMarker> = () => {
  return <img className="meMarkerImage" src={"../images/meMarker.svg"} alt="home" />;
};
