import React from "react";
import type {NextPage} from "next";

// components
import {Bio} from "../../components/Profile/Bio/bio";
import Locations from "../../components/Profile/Locations/locations";
import {Photos} from "../../components/Profile/Photos/photos";
import {Services} from "../../components/Profile/Services/services";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";

const ProfilePage: NextPage = (): JSX.Element => {
  return (
    <>
      <LayoutDentist>
        <Bio />
        <Locations />
        <Services />
        <Photos />
      </LayoutDentist>
    </>
  );
};

export default ProfilePage;
