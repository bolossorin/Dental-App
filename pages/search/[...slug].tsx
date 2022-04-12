import React, {useEffect, useState} from "react";

// libs
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";

// components
import {Header, IDentistFullDataResponse} from "../../components";
import {Footer} from "../../components/Footer/Footer";
import Person from "../../components/Person/Person";
import {IUserGallery} from "../../reducers/types";
import {getDentistByEmailApi, getDentistGalleryByEmailApi, getDentistServicesApi} from "../../api/AWS-gateway";


const PersonPage = () => {
  const router = useRouter()
  const {slug} = router.query

  const [dentist, setDentist] = useState<IDentistFullDataResponse | null>(null);
  const [gallery, setGallery] = useState<IUserGallery[]>([]);
  const [dentistServices, setDentistServices] = useState<IUserGallery[]>([]);

  useEffect(() => {
    if (slug) {
      getDentistByEmailApi(slug[0])
        .then(({data}) => setDentist(data))
        .catch((error) => console.error(error, 'error'));

      getDentistGalleryByEmailApi(slug[0])
        .then(({data}) => setGallery(data))
        .catch((error) => console.error(error, 'error'));

      getDentistServicesApi(slug[0])
        .then(({data}) => setDentistServices(data))
        .catch((error) => console.log(error, 'error'))
    }
  }, [slug]);
  return (
    <>
      <Header />
      {!(dentist && gallery) && <Skeleton width="100wh" height="90vh" />}
      {!!(dentist && gallery) && (<Person dentistServices={dentistServices} dentist={dentist} gallery={gallery} />)}
      <Footer />
    </>
  );
};

export default PersonPage;
