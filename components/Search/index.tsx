import {useEffect, useState} from "react";

// libs
import axios from "axios";

// components
import {DentistCards} from "./Card";
import {GoogleMap} from "./Map";
import {SearchParams} from "./SearchParams";
import {API} from "../../api/AWS-gateway";

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
  location: object;
  username: string;
  qualifications: string;
}

interface SearchProps {
}

const findRequest = (obj: {
  lat: number;
  lng: number;
  service: string | undefined;
  miles: MILES | undefined;
}) => {
  return new Promise<SearchDentistiResult[]>(async (resolve) => {
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

const nearlyDentistsInitial = [
  {
    accountType: 'free',
    avatar_url: '../images/doctor1.png',
    email: 'email#email.com',
    key: '1',
    lat: 52.2042666,
    lng: 0.1149085,
    location: {
      lat: 52.2042666,
      lng: 0.1149085
    },
    username: 'Dr Jane Doe',
    qualifications: 'Doctor'
  },
  {
    accountType: 'free',
    avatar_url: '../images/doctor2.png',
    email: 'email#email.com',
    key: '2',
    lat: 51.2042666,
    lng: 1.1149085,
    location: {
      lat: 51.2042666,
      lng: 0.1149085
    },
    username: 'Karina Ole',
    qualifications: 'Doctor'
  },
  {
    accountType: 'pay',
    avatar_url: '../images/doctor3.png',
    email: 'email#email.com',
    key: '3',
    lat: 12.2042666,
    lng: 1.1149085,
    location: {
      lat: 12.2042666,
      lng: 1.1149085,
    },
    username: 'Mary Mask',
    qualifications: 'Doctor'
  },
  {
    accountType: 'free',
    avatar_url: '../images/doctor1.png',
    email: 'email#email.com',
    key: '4',
    lat: 56.2042666,
    lng: 8.1149085,
    location: {
      lat: 56.2042666,
      lng: 8.1149085,
    },
    username: 'Dr Jane Doe',
    qualifications: 'Doctor'
  },
  {
    accountType: 'free',
    avatar_url: '../images/doctor2.png',
    email: 'email#email.com',
    key: '5',
    lat: 2.2042666,
    lng: 3.1149085,
    location: {
      lat: 2.2042666,
      lng: 3.1149085,
    },
    username: 'Karina Ole',
    qualifications: 'Doctor'
  },
]

const Search: React.FC<SearchProps> = () => {
  const [showMap, setShowMap] = useState(true);
  const [selectedDentist, setSelectedDent] = useState<SearchDentistiResult>();
  const [nearlyDentists, setDentist] = useState<SearchDentistiResult[]>(nearlyDentistsInitial);

  const [myLocation, setMyLocation] = useState<ILocation>();

  const setSelectedDentist = (dent: any) => setSelectedDent(dent);

  useEffect(() => {
    (async () => {
      try {
        await axios.get<any>(API.GET_ALL_DENTISTS);
      } catch (exp) {
        console.log(exp, 'error')
      }
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
    } catch (exp) {
      console.error(exp, 'error')
    }
  };

  return (
    <>
      <SearchParams
        setShowMap={setShowMap}
        showMap={showMap}
        findDentist={findDentist}
        setMyLocation={setMyLocation} />
      <div className="index-box-to-box">
        {showMap && (<GoogleMap
          nearlyDentists={nearlyDentists}
          setSelectedDentist={setSelectedDentist}
          selectedTarget={selectedDentist}
          myLocation={myLocation}
          setMyLocation={setMyLocation} />)}
        <DentistCards
          setSelectedDentist={setSelectedDentist}
          selectedTarget={selectedDentist}
          nearlyDentists={nearlyDentists}
          setMyLocation={setMyLocation} />
      </div>
    </>
  );
};

export default Search;
