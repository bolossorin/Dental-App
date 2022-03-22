import React from "react";
import type {NextPage} from "next";

// components
import {Gallery} from "../../components/Galery/Galery";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";

const GalleryPage: NextPage = (): JSX.Element => {
  return (
    <LayoutDentist>
      <Gallery />
    </LayoutDentist>
  );
};

export default GalleryPage;
