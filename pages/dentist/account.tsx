import React from "react";
import type { NextPage } from "next";
import { Header } from "../../components";
import LeftMenu from "../../components/LeftMenu/OnProfile/leftMenu";
import Skeleton from "react-loading-skeleton";
import { useLocalData } from "../../hooks/useLocalData";
import { Account } from "../../components/Account";

const AccountPage: NextPage = (): JSX.Element => {
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
                <Account />
              </>
            )}
          </div>
        </>
      </section>
    </>
  );
};

export default AccountPage;
