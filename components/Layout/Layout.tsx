import {Header} from "../Header/Header";
import React from "react";

export const Layout = ({children}) => {
  return (
    <section className="container-vh">
      <Header />
      <div className="main bg-login main-height-full">
        {children}
      </div>
    </section>
  )
}
