import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { API } from "../../api/AWS-gateway";
import { Header, IDentistFullDataResponse } from "../../components";
import { Footer } from "../../components/Footer/Footer";
import Person from "../../components/Person";
import { IUserGallery } from "../../reducers/types";

// import { ISetNotofication } from "../../components/Toast";
// import notify from "../../components/Toast";
// import { useLocalData } from "../../hooks/useLocalData";

const PersonPage = () => {
  const [data, setData] = useState<IDentistFullDataResponse>();
  const [galleryData, setGalleryData] = useState<IUserGallery[]>();

  const router = useRouter();
  const email = router.asPath.split("/")[2];

  // const setNotification = useCallback<ISetNotofication>(
  //   ({ ...notifyProps }) => {
  //     notify({ ...notifyProps });
  //   },
  //   []
  // );

  useEffect(() => {
    (async () => {
      try {
        const info = await axios.get<IDentistFullDataResponse>(
          `${API.GET_DENTIST_FULL_DATA}?email=${email}`
        );
        setData(info.data);
      } catch (exp: any) {
        console.log(exp);
      }

      try {
        const gallery = await axios.get<IUserGallery[]>(
          `${API.SET_DENTIST_GALLERY}?email=${email}`
        );
        setGalleryData(gallery.data);
      } catch (exp) {
        console.log(exp);
      }
    })();
  }, [email]);
  return (
    <>
      <Head>
        <title>Dental App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta property="og:locale" content="en_EN" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <section>
        <Header />
        {!!(data && galleryData) && (
          <Person dentist={data} galleryData={galleryData} />
        )}
        {!(data && galleryData) && <Skeleton width="100wh" height="90vh" />}
        <Footer />
      </section>
    </>
  );
};

export default PersonPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      data: "",
    },
  };
};
