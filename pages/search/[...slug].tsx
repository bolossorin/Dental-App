import React, {useEffect, useState} from "react";

// libs
import axios from "axios";
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";

// components
import {API} from "../../api/AWS-gateway";
import {Header, IDentistFullDataResponse} from "../../components";
import {Footer} from "../../components/Footer/Footer";
import Person from "../../components/Person";
import {IUserGallery} from "../../reducers/types";
import {dataInitial, personInitial} from "../../mock/search";


const PersonPage = () => {
  const [data, setData] = useState<IDentistFullDataResponse>(dataInitial);
  const [galleryData, setGalleryData] = useState<IUserGallery[]>(personInitial);

  const router = useRouter();
  const email = router.asPath.split("/")[2];

  useEffect(() => {
    (async () => {
      try {
        const info = await axios.get<IDentistFullDataResponse>(`${API.GET_DENTIST_FULL_DATA}?email=${email}`);
        setData(info.data);
      } catch (exp: any) {
        console.log(exp);
      }

      try {
        const gallery = await axios.get<IUserGallery[]>(`${API.SET_DENTIST_GALLERY}?email=${email}`);
        setGalleryData(gallery.data);
      } catch (exp) {
        console.log(exp);
      }
    })();
  }, [email]);
  return (
    <>
      <Header />
      {!(data && galleryData) && <Skeleton width="100wh" height="90vh" />}
      {!!(data && galleryData) && (<Person dentist={data} galleryData={galleryData} />)}
      <Footer />
    </>
  );
};

export default PersonPage;
