import React from "react";

// libs
import type {NextPage} from "next";
import {CurrentMonth} from "../../components/Dashboard/CurrentMonth/CurrentMonth";
import {TotalSubs} from "../../components/Dashboard/TotalSubs/TotalSubs";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";

const DashboardPage: NextPage = (): JSX.Element => {

  return (
    <LayoutDentist adminMenu>
      <CurrentMonth />
      <TotalSubs />
    </LayoutDentist>
  );
};

export default DashboardPage;
