import {Header} from "../Header/Header";
import React from "react";
import {Footer} from "../Footer/Footer";

export const Layout = ({footer, children}: any) => {
  return (
    <section className="container-vh">
      <Header adminMenu={false} />
      <div className="main bg-login">
        {children}
      </div>
      {footer && <Footer />}
    </section>
  )
}
