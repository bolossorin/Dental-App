import React, {useContext, useEffect, useState} from "react";

// libs
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";

// components
import {Header, IDentistFullDataResponse} from "../../components";
import {Footer} from "../../components/Footer/Footer";
import Person from "../../components/Person/Person";
import {IUserGallery} from "../../reducers/types";
import {getDentistByEmailApi, getDentistGalleryByEmailApi, getDentistServicesApi} from "../../api/AWS-gateway";
import {AppContext} from "../../context/app.context";
import {DentistTypes} from "../../reducers";


const PersonPage = () => {
  const router = useRouter()
  const {slug} = router.query

  const {dispatch} = useContext(AppContext);

  const [dentist, setDentist] = useState<IDentistFullDataResponse | null>(null);
  const [gallery, setGallery] = useState<IUserGallery[]>([]);

  useEffect(() => {
    if (slug) {
      getDentistByEmailApi(slug[0])
        .then(({data}) => setDentist(data))
        .catch((error) => console.error(error, 'error'));

      getDentistGalleryByEmailApi(slug[0])
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
      {!(dentist && gallery) && <Skeleton width="100wh" height="90vh" />}
      {!!(dentist && gallery) && (<Person dentist={dentist} gallery={gallery} />)}
      <Footer />
    </>
  );
};

export default PersonPage;
