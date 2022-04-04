import React, {useEffect, useState} from "react";

//libs
import Skeleton from "react-loading-skeleton";

// components
import {DentistCards} from "./Card/Card";
import {GoogleMap} from "./Map/Map";
import {SearchParams} from "./SearchParams/SearchParams";
import {getAllDentistAPI} from "../../api/AWS-gateway";

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

export type searchFunc = (service: string | undefined, miles: MILES | undefined) => Promise<any>;

export interface SearchDentistResult {
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

const Search: React.FC = () => {
  const [showMap, setShowMap] = useState(true);
  const [selectedDentist, setSelectedDentist] = useState<SearchDentistResult>();
  const [allDentists, setAllDentists] = useState<SearchDentistResult[]>([]);
  const [myLocation, setMyLocation] = useState<ILocation>();

  useEffect(() => {
    getAllDentistAPI().then(({data}) => setAllDentists(data)).catch((error) => console.log(error, 'error'))
  }, []);

  return (
    <main>
      <SearchParams
        setShowMap={setShowMap}
        showMap={showMap}
        myLocation={myLocation}
        setMyLocation={setMyLocation}
        setAllDentists={setAllDentists} />
      {allDentists.length > 0 ? <div className="index-box-to-box">
        {showMap && (<GoogleMap
          allDentists={allDentists}
          setSelectedDentist={setSelectedDentist}
          selectedDentist={selectedDentist}
          myLocation={myLocation}
          setMyLocation={setMyLocation} />)}
        <DentistCards
          setSelectedDentist={setSelectedDentist}
          selectedDentist={selectedDentist}
          allDentists={allDentists}
          setMyLocation={setMyLocation} />
      </div> : <Skeleton count={3} width="100wh" height="23vh" />}

    </main>
  );
};

export default Search;
