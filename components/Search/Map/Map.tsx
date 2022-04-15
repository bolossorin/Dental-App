import React, {useEffect, useCallback} from "react";

// libs
import GoogleMapReact from "google-map-react";

// components
import {MeMarker} from "./Markers/Me/Me";
import {DentistMarker} from "./Markers/Target/Target";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ILocation, SearchDentistResult} from "../Search";

interface IMapProps {
  allDentists: any;
  setSelectedDentist: (dent: SearchDentistResult) => void;
  selectedDentist: any;
  myLocation: ILocation | undefined;
  setMyLocation: (loc: ILocation) => void;
}

const Locations = {cambridge: {lat: 52.2042666, lng: 0.1149085}};

export const GoogleMap: React.FC<IMapProps> = (
  {
    allDentists,
    setSelectedDentist,
    selectedDentist,
    myLocation,
    setMyLocation,
  }) => {

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setNotification({type: "info", message: "Geolocation is not supported by your browser"});
      setMyLocation(Locations.cambridge);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
          const pos = {lat: position.coords.latitude, lng: position.coords.longitude};
          localStorage.setItem("myLocation", JSON.stringify(pos));
          setMyLocation(pos);
        }, () => {
          setMyLocation(Locations.cambridge);
          setNotification({type: "warning", message: "Unable to retrieve your location"});
        }
      );
    }
  }, []);

  return (
    <div className="main-index index-main-box">
      <div className="map">
        {myLocation && (<div className="Google-react-map-wrapper">
          <GoogleMapReact
            center={selectedDentist ? selectedDentist.locations[0] : myLocation}
            bootstrapURLKeys={{key: `${process.env.NEXT_PUBLIC_GOOGLE_KEY}`}}
            defaultCenter={Locations.cambridge}
            defaultZoom={13}>
            <MeMarker {...myLocation} />
            {allDentists.map((locations, index) =>
              locations.locations && locations.locations.map(location =>
                location.lat && <DentistMarker
                  currentDentist={allDentists[index]}
                  key={location.id}
                  location={location}
                  lat={+location.lat}
                  lng={+location.lng}
                  selectedDentist={selectedDentist}
                  setSelectedDentist={setSelectedDentist} />))}
          </GoogleMapReact>
        </div>)}
      </div>
    </div>
  );
};
