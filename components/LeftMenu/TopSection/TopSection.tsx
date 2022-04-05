import Link from "next/link";
import {routes} from "../../../utils/routes";
import React, {useContext} from "react";
import {AppContext} from "../../../context/app.context";

export const TopSection =()=>{
  const {state} = useContext(AppContext);
  const {avatarUrl, dentist_name} = state.dentistState;

  return(
    <>
      <div className="link-active">
        <Link href={routes.home}>
          <img
            src={"../../images/FYD4_beige-on-green@2x.png"}
            srcSet={"../../images/FYD4_beige-on-green@2x.png 2x, ../../images/FYD4_beige-on-green@3x.png 3x"}
            className="logo-image desctop-visible"
            alt="logo image" />
        </Link>
      </div>
      <div className="leftmenu-user-information">
        <img className="user-image" src={avatarUrl || "../../images/empty_avatar.png"} alt="profile image" />
        <div className="user-description white">
          <span>{dentist_name?.split(" ")[0] || ""}</span>
          <span>{dentist_name?.split(" ")[1] || ""}</span>
        </div>
      </div>
    </>
  )
}
