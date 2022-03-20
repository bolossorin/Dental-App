import React from "react";
import type {NextPage} from "next";

// components
import {Bio} from "../../components/Profile/Bio/Bio";
import Locations from "../../components/Profile/Locations/Locations";
import {Photos} from "../../components/Profile/Photos/Photos";
import {Services} from "../../components/Profile/Services/services";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";

const ProfilePage: NextPage = (): JSX.Element => {
  return (
    <>
      <LayoutDentist adminMenu={false}>
        <Bio />
        <Locations />
        <Services />
        <Photos />
      </LayoutDentist>
    </>
  );
};

export default ProfilePage;
