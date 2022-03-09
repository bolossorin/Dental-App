import { DentistCards } from "./Card";
import { GoogleMap } from "./Map";
import { SearchParams } from "./SearchParams";
import { useEffect, useState } from "react";
import { dentists } from "../../mock/search";
import axios from "axios";
import { API } from "../../api/AWS-gateway";

export interface ILocation {
  lat: number;
  lng: number;
}

export enum MILES {
  ONE = "1",
  FIVE = "5",
  TEN = "10",
  twenty = "20",
  thirty = "30",
  forty = "40",
  fifty = "50",
}

export type searchFunc = (
  service: string | undefined,
  miles: MILES | undefined
) => Promise<any>;

export interface SearchDentistiResult {
  accountType: string;
  avatar_url: string;
  email: string;
  key: string;
  lat: number;
  lng: number;
  location: string;
  username: string;
  qualifications: string;
}

interface SearchProps {}

const findRequest = (obj: {
  lat: number;
  lng: number;
  service: string | undefined;
  miles: MILES | undefined;
}) => {
  return new Promise<SearchDentistiResult[]>(async (resolve, rej) => {
    // setTimeout(() => {
    //   resolve(dentists);
    // }, 3000);
    const body = {
      lat: obj.lat,
      lng: obj.lng,
      serviceId: obj.service || null,
      miles: obj.miles || null,
    };
    const res = await axios.post<SearchDentistiResult[]>(
      "/api/dentist/search/map",
      body
    );
    resolve(res.data);
  });
};

const Search: React.FC<SearchProps> = () => {
  const [showMap, setShowMap] = useState(true);
  const [selectedDentist, setSelectedDent] = useState<SearchDentistiResult>();
  const [nearlyDentists, setDentist] = useState<SearchDentistiResult[]>([]);

  const [myLocation, setMyLocation] = useState<ILocation>();

  const setSelectedDentist = (dent: any) => {
    setSelectedDent(dent);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<any>(API.GET_ALL_DENTISTS);
      } catch (exp) {}
    })();
  }, []);

  const findDentist: searchFunc = async (service, miles) => {
    try {
      if (myLocation) {
        const dentists = await findRequest({
          lat: myLocation?.lat,
          lng: myLocation?.lng,
          service,
          miles,
        });
        setDentist(dentists);
      }
    } catch (exp) {}
  };

  return (
    <>
      <SearchParams
        setShowMap={setShowMap}
        showMap={showMap}
        findDentist={findDentist}
        myLocation={myLocation}
        setMyLocation={setMyLocation}
      />
      <div className="index-box-to-box">
        {showMap && (
          <GoogleMap
            targets={nearlyDentists}
            selectTarget={setSelectedDentist}
            selectedTarget={selectedDentist}
            myLocation={myLocation}
            setMyLocation={setMyLocation}
          />
        )}
        <DentistCards
          selectTarget={setSelectedDentist}
          selectedTarget={selectedDentist}
          dentists={nearlyDentists}
        />
      </div>
    </>
  );
};

export default Search;
