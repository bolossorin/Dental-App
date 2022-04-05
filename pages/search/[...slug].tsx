import React, {useEffect, useState} from "react";

// libs
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";

// components
import {Header, IDentistFullDataResponse} from "../../components";
import {Footer} from "../../components/Footer/Footer";
import Person from "../../components/Person/Person";
import {IUserGallery} from "../../reducers/types";
import {personInitial} from "../../mock/search";
import {getDentistByEmailAPI, getDentistGalleryByEmailAPI} from "../../api/AWS-gateway";


const PersonPage = () => {
  const router = useRouter()
  const {slug} = router.query

  const [dentist, setDentist] = useState<IDentistFullDataResponse | null>(null);
  const [gallery, setGallery] = useState<IUserGallery[]>(personInitial);

  useEffect(() => {
    if (slug) {
      getDentistByEmailAPI(slug[0]).then(({data}) => setDentist(data)).catch((error) => console.error(error, 'error'));
      getDentistGalleryByEmailAPI(slug[0]).then(({data}) => setGallery(data)).catch((error) => console.error(error, 'error'));
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
