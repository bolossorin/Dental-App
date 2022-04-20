import React, {useEffect, useState} from "react";

// components
import {DentistCards} from "./Card/Card";
import {GoogleMap} from "./Map/Map";
import {SearchParams} from "./SearchParams/SearchParams";
import {getAllDentistApi} from "../../api/AWS-gateway";

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

export interface SearchDentistResult {
  subscription_plan: string;
  gdc: string;
  avatarUrl: string;
  watermarkUrl: string;
  email: string;
  key: string;
  lat: number;
  lng: number;
  location: object;
  dentist_name: string;
  qualifications: string;
}

const Search: React.FC = () => {
  const [showMap, setShowMap] = useState(true);
  const [selectedDentist, setSelectedDentist] = useState<SearchDentistResult>();
  const [allDentists, setAllDentists] = useState<SearchDentistResult[]>([]);
  const [myLocation, setMyLocation] = useState<ILocation>();

  useEffect(() => {
    getAllDentistApi().then(({data}) => setAllDentists(data)).catch((error) => console.log(error, 'error'))
  }, []);

  return (
    <main>
      <SearchParams
        setShowMap={setShowMap}
        showMap={showMap}
        myLocation={myLocation}
        setAllDentists={setAllDentists} />
      <div className="index-box-to-box">
        {showMap && (<GoogleMap
          allDentists={allDentists}
          setSelectedDentist={setSelectedDentist}
          selectedDentist={selectedDentist}
          myLocation={myLocation}
          setMyLocation={setMyLocation} />)}
        <DentistCards
          setSelectedDentist={setSelectedDentist}
          selectedDentist={selectedDentist}
          allDentists={allDentists} />
      </div>
    </main>
  );
};

export default Search;
