import React, {useEffect} from "react";

// libs
import Router from "next/router";

// components
import {Layout} from "../components";
import {RegisterForm} from "../components/register/RegisterForm/RegisterForm";
import {routes} from "../utils/routes";

export interface IRegisterFormChildren {
  dentist_name: string;
  email: string;
  gdc: number | "";
  password: string;
}

const Register = (): JSX.Element => {

  useEffect(() => {
    if (localStorage.getItem('access_token')) Router.push(routes.account)
  }, []);

  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

export default Register;
