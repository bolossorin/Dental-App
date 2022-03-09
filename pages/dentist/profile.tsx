import React from "react";
import type { NextPage } from "next";
import { Header } from "../../components";
import { Bio } from "../../components/Profile/Bio/bio";
import Locations from "../../components/Profile/Locations/locations";
import { Photos } from "../../components/Profile/Photos/photos";
import { Services } from "../../components/Profile/Services/services";
import LeftMenu from "../../components/LeftMenu/OnProfile/leftMenu";
import Skeleton from "react-loading-skeleton";
import { useLocalData } from "../../hooks/useLocalData";

const ProfilePage: NextPage = (): JSX.Element => {
  const { loading } = useLocalData();
  return (
    <>
      <section className="container-profile ">
        <>
          <div className="mobile-header">
            <Header />
          </div>
          <>
            <LeftMenu />
          </>
          <div className="main-profile bg-white ">
            {loading && (
              <Skeleton
                count={4}
                duration={1.2}
                height={"23vh"}
                enableAnimation={true}
                containerClassName="main-profile bg-white"
              />
            )}
            {!loading && (
              <>
                <Bio />
                <Locations />
                <Services />
                <Photos />
              </>
            )}
          </div>
        </>
      </section>
    </>
  );
};

export default ProfilePage;
