import React from "react";
import type { NextPage } from "next";
import { Header } from "../../components";
import LeftMenu from "../../components/LeftMenu/OnProfile/leftMenu";
import { Gallery } from "../../components/Galery";

const GalleryPage: NextPage = (): JSX.Element => {
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
        </>
        <div className="main-profile bg-white ">
          <Gallery />
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
