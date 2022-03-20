import React from "react";

// libs
import type {NextPage} from "next";

// components
import {Users} from "../../components/Users/Users";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";

const UsersPage: NextPage = (): JSX.Element => {
  return (
    <LayoutDentist>
      <Users />
    </LayoutDentist>
  );
};

export default UsersPage;
