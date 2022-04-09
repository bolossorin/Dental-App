import React, {useEffect, useState} from "react";

// libs
import axios from "axios";

// components
import {ILocation, MILES, SearchDentistResult, searchFunc} from "../Search";
import {useDebounce} from "../../../hooks/useDebounce";
import {IService} from "../../../reducers/types";

interface ISearchParamsProps {
  showMap: boolean;
  myLocation: any;
  setShowMap: (status: boolean) => void;
  setMyLocation: (loc: ILocation) => void;
  setAllDentists: any;
}

const findRequest = (obj: { lat: number; lng: number; service: string | undefined; miles: MILES | undefined; }) => {
  return new Promise<SearchDentistResult[]>(async (resolve) => {
    const body = {lat: obj.lat, lng: obj.lng, serviceId: obj.service || null, miles: obj.miles || null};

    const res = await axios.post<SearchDentistResult[]>("/api/dentist/search/map", body);
    resolve(res.data);
  });
};

export const SearchParams: React.FC<ISearchParamsProps> = (
  {
    showMap,
    setShowMap,
    setMyLocation,
    myLocation,
    setAllDentists
  }) => {
  const [postCode, setPostCode] = useState("");
  const [service, setService] = useState("");
  const [allServices,
    // setAllServices
  ] = useState<IService[]>([]);
  const [miles, SetMiles] = useState<MILES>();

  const handleSwitch = () => setShowMap(!showMap);

  const handleSearch = async () => await findDentist(service, miles);

  useEffect(() => {
    // axios
    //   .get<IService[]>(`${API.DENTIST_SERVICES}`)
    //   .then(({data}) => {
    //     setAllServices(data);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }, []);

  const debouncedSearchTerm = useDebounce(postCode, 300);

  // Effect for API call
  useEffect(
    () => {
      if (!!debouncedSearchTerm) {
        fetch(`https://maps.google.com/maps/api/geocode/json?sensor=false&address=${debouncedSearchTerm}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`)
          .then((res) => res.json())
          .then((res) => {
            setMyLocation(res.results[0].geometry.location)
          });
      } else {
        const Locations = {cambridge: {lat: 52.2042666, lng: 0.1149085}};

        const oldLocation = JSON.parse(localStorage.getItem("myLocation") || "false");
        setMyLocation(oldLocation || Locations.cambridge);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  const handlechangePostcode = async (e) => {
    const searchValue = e.target.value;
    if (searchValue[0] === " ") return;

    setPostCode(searchValue);
  };

  const findDentist: searchFunc = async (service, miles) => {
    if (myLocation) {
      const dentists = await findRequest({lat: myLocation?.lat, lng: myLocation?.lng, service, miles});
      setAllDentists(dentists);
    }
  };

  return (
    <div className="index-box-to-box">
      <div className="index-box-to-box-top">
        <div className="box-left">
          <div className="index-search-gallery">
            <input
              className="search-postcode"
              type="text"
              id="postcode"
              name="postcode"
              value={postCode}
              onChange={handlechangePostcode}
              placeholder=" Postcode" />
            <div className="clearSearchInput">
              <img className="form-login-input-close" src={"../images/close.svg"} alt='' />
            </div>
            <img className="search-button" src={"../images/search.svg"} alt="search" />
          </div>
          <p className="row-content-index">
            <select
              className="index-select arrows"
              name="services"
              id="services"
              defaultValue=""
              onChange={(e) => setService(e.target.value)}>
              <option value="">Select Service</option>
              {allServices &&
              allServices.map((item) =>
                <option value={item.id} key={item.id}>
                  {item.service_name}
                </option>)}
            </select>
          </p>
          <p className="row-content-index">
            <select
              className="index-select arrows"
              name="services"
              id="services"
              defaultValue=""
              onChange={(e) => SetMiles(e.target.value as any)}>
              <option value="">Select Mile</option>
              <option value={MILES.ONE}>Within: {MILES.ONE} Mile</option>
              <option value={MILES.FIVE}>Within: {MILES.FIVE} Mile</option>
              <option value={MILES.TEN}>Within: {MILES.TEN} Miles</option>
              <option value={MILES.twenty}>Within: {MILES.twenty} Miles</option>
              <option value={MILES.thirty}>Within: {MILES.thirty} Miles</option>
              <option value={MILES.forty}>Within: {MILES.forty} Miles</option>
              <option value={MILES.fifty}>Within: {MILES.fifty} Miles</option>
            </select>
          </p>
          <button type='button' className="button-green-search" onClick={handleSearch}>
            Find My Dentist
          </button>
        </div>
        <h1 className="title-dentist">Find Your Dentist</h1>
        <div className="box-right">
          {<p className="switcher-text"
              style={{
                color: !showMap ? "black" : "GrayText",
                fontWeight: !showMap ? "bold" : "lighter",
              }}>
            List Search
          </p>}
          <p className="switcher"
             style={{padding: `4px 4px 4px ${!showMap ? "4px" : "20px"}`}}
             onClick={handleSwitch}>
            <span className="switcher-dot" />
          </p>
          {<p className="switcher-text"
              style={{
                color: showMap ? "black" : "GrayText",
                fontWeight: showMap ? "bold" : "lighter",
              }}>
            Map Search
          </p>}
        </div>
      </div>
    </div>
  );
};
