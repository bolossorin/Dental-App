import React from "react";

// libs
import Skeleton from "react-loading-skeleton";

// components
import {Header} from "../components";
import {Footer} from "../components/Footer/Footer";
import Search from "../components/Search/Search";
import {useLocalData} from "../hooks/useLocalData";

const Home = (): JSX.Element => {
  const {loading} = useLocalData();

  return (
    <>
      {loading ? <Skeleton width={"100vw"} height={"70px"} /> : <Header />}
      <Search />
      <Footer />
    </>
  );
};

export default Home;
