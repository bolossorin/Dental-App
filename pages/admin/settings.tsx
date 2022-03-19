import React from "react";

// libs
import type {NextPage} from "next";
import Skeleton from "react-loading-skeleton";

// components
import {Header} from "../../components";
import LeftMenu from "../../components/LeftMenu/OnProfile/OnProfile";
import {AdminSettings} from "../../components/Settings/Settings";
import {useLocalData} from "../../hooks/useLocalData";

const SettingsPage: NextPage = (): JSX.Element => {
  const {loading} = useLocalData();
  return (
    <section className="container-profile ">
      <div className="mobile-header">
        <Header />
      </div>
      <LeftMenu />
      <div className="main-profile bg-white ">
        {loading && (<Skeleton
          count={4}
          duration={1.2}
          height={"45vh"}
          enableAnimation={true}
          containerClassName="main-profile bg-white" />)}
        {!loading && (<AdminSettings />)}
      </div>
    </section>
  );
};

export default SettingsPage;
