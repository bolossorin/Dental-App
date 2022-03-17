import React from "react";

// components
import {Header} from "../../Header/Header";
import LeftMenu from "../../LeftMenu/OnProfile/leftMenu";
import Skeleton from "react-loading-skeleton";
import {useLocalData} from "../../../hooks/useLocalData";

export const LayoutDentist = ({children})=> {
  const {loading} = useLocalData();

  return  <section className="container-profile ">
    <div className="mobile-header"><Header /></div>
    <LeftMenu />
    <div className="main-profile bg-white ">
      {loading && (<Skeleton
        count={4}
        duration={1.2}
        height={"23vh"}
        enableAnimation={true}
        containerClassName="main-profile bg-white" />)}
      {!loading && children}
    </div>
  </section>
}
