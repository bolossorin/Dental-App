import React, {useContext, useEffect, useState} from "react";

// libs
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";

// components
import {Header} from "../../components";
import {Footer} from "../../components/Footer/Footer";
import Person from "../../components/Person/Person";
import {IUserGallery} from "../../reducers/types";
import {getDentistByEmailApi, getDentistGalleryApi, getDentistServicesApi} from "../../api/AWS-gateway";
import {AppContext} from "../../context/app.context";
import {DentistTypes} from "../../reducers";


const PersonPage = () => {
  const router = useRouter()
  const {slug} = router.query

  const {dispatch} = useContext(AppContext);

  const [gallery, setGallery] = useState<IUserGallery[] | null>(null);

  useEffect(() => {
    if (slug) {
      getDentistByEmailApi(slug[0])
        .then(({data}) => dispatch({type: DentistTypes.SET_FULL_DATA, payload: data}))
        .catch((error) => console.error(error, 'error'));

      getDentistGalleryApi(slug[0])
        .then(({data}) => setGallery(data))
        .catch((error) => console.error(error, 'error'));

      getDentistServicesApi(slug[0])
        .then(({data}) => dispatch({type: DentistTypes.SET_ALL_SERVICES, payload: data}))
        .catch((error) => console.log(error, 'error'))
    }
  }, [slug]);

  return (
    <>
      <Header />
      {!gallery ? <Skeleton height="90vh" /> : <Person gallery={gallery} />}
      <Footer />
    </>
  );
};

export default PersonPage;
