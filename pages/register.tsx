import type { NextPage } from "next";
import { Header, RegisterForm } from "../components";

const Register: NextPage = (): JSX.Element => {
  return (
    <>
      <section className="container-vh">
        <Header />
        <RegisterForm />
      </section>
    </>
  );
};

export default Register;
