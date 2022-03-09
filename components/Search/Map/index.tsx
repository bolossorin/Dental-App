import React, { useEffect, useCallback, useState } from "react";
import GoogleMapReact from "google-map-react";
// import { dentists } from '../../../mock/search';
import { API } from "../../../api/AWS-gateway";
import { MeMarker } from "./Markers/Me";
import { DentistMarker } from "./Markers/Target";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import { ILocation, SearchDentistiResult } from "..";
interface IMapProps {
  targets: SearchDentistiResult[];
  selectTarget: (dent: SearchDentistiResult) => void;
  selectedTarget: SearchDentistiResult | undefined;
  myLocation: ILocation | undefined;
  setMyLocation: (loc: ILocation) => void;
}

const Locations = {
  cambridge: {
    lat: 52.2042666,
    lng: 0.1149085,
  },
};

export const GoogleMap: React.FC<IMapProps> = ({
  targets,
  selectTarget,
  selectedTarget,
  myLocation,
  setMyLocation,
}) => {
  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const getLocation = () => {
    if (!navigator.geolocation) {
      setNotification({
        type: "info",
        message: "Geolocation is not supported by your browser",
      });
      setMyLocation(Locations.cambridge);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          localStorage.setItem("myLocation", JSON.stringify(pos));
          setMyLocation(pos);
        },
        () => {
          setMyLocation(Locations.cambridge);
          setNotification({
            type: "warning",
            message: "Unable to retrieve your location",
          });
        }
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="main-index index-main-box left-size">
      <div className="map">
        {myLocation && (
          <div className="Google-react-map-wrapper">
            <GoogleMapReact
              center={myLocation}
              bootstrapURLKeys={{ key: `${process.env.GOOGLE_KEY}` }}
              defaultCenter={Locations.cambridge}
              defaultZoom={13}
            >
              <MeMarker {...myLocation} />
              {targets.map((target) => {
                return (
                  <DentistMarker
                    key={target.key}
                    target={target}
                    lat={target.lat}
                    lng={target.lng}
                    selectedTarget={selectedTarget}
                    selectTarget={selectTarget}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
        )}
      </div>
    </div>
  );
};
