import React, {useState, useContext} from "react";

// libs
import Link from "next/link";
import Router from "next/router";

// components
import {AppContext} from "../../context/app.context";
import {useLogout} from "../../hooks/useLogout";
import {LeftMenuOnMobile} from "../LeftMenu/LeftMenuOnMobile/LeftMenuOnMobile";
import {routes} from "../../utils/routes";
import {Null_Or_} from "../../reducers/types";

interface IMenu {
  adminMenu: Null_Or_<boolean>;
}

export const Header: React.FC<IMenu> = ({adminMenu = null}) => {
  const {state} = useContext(AppContext);
  const {isLogged} = state.userState;
  const [toggle, setToggle] = useState(false);

  const [logOut] = useLogout(() => setToggle(false));

  return (
    <div className='header-wrapper'>
      <div className="header_shadow" />
      <div className="header bg-green">
        <div className="menu" id="mobile_menu">
          {!isLogged ? (<svg
            className="menu-logo"
            xmlns="http://www.w3.org/2000/svg"
            height="28px"
            viewBox="0 0 28 20"
            width="20px"
            onClick={() => setToggle(true)}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>) : null}
        </div>
        <Link href="/">
          <img
            src={"../images/FYD4_beige-on-green@2x.png"}
            srcSet={"../images/FYD4_beige-on-green@2x.png 2x, ../images/FYD4_beige-on-green@3x.png 3x"}
            className="logo-image"
            style={{cursor: "pointer"}}
            alt='' />
        </Link>
        <div className="header_actions">
          {isLogged ? <>
            <button className="button-green-login" onClick={() => Router.push(routes.login)}>Login</button>
            <button className="button-green-register" onClick={() => Router.push(routes.register)}>Register</button>
          </> : <button className="button-green-login" onClick={logOut}>Logout</button>}
        </div>
        <div />
      </div>
      <LeftMenuOnMobile adminMenu={adminMenu} setToggle={setToggle} toggle={toggle} />
    </div>
  );
};
