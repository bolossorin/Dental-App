import Link from "next/link";
import {useState, useContext} from "react";
import {AppContext} from "../../context/app.context";
import {useLogout} from "../../hooks/useLogout";
import {CollapsedSidebar} from "../LeftMenu/OnHeader/Sidebar";

export const Header: React.FC = () => {
  const {state} = useContext(AppContext);
  const {isLogged} = state.userState;
  const [toggle, setToggle] = useState(false);
  const [logOut] = useLogout(() => {
    setToggle(false);
  });

  return (
    <>
      <div className="header_shadow" />
      <div className="header bg-green">
        <div className="menu" id="mobile_menu">
          {isLogged ? (
            <svg
              className="menu-logo"
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 0 28 20"
              width="20px"
              onClick={() => setToggle(true)}>
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          ) : (<div className="menu-logo" />)}
        </div>
        <div>
          <Link href="/">
            <img
              src={"../images/FYD4_beige-on-green@2x.png"}
              srcSet={"../images/FYD4_beige-on-green@2x.png 2x, ../images/FYD4_beige-on-green@3x.png 3x"}
              className="logo-image"
              style={{cursor: "pointer"}}
              alt=''
            />
          </Link>
        </div>
        <div className="header_actions">
          {!isLogged ? (
            <>
              <Link href={"../../../login"}>
                <button className="button-green-login">Login</button>
              </Link>
              <Link href={"../../../register"}>
                <button className="button-green-register">Register</button>
              </Link>
            </>
          ) : (
            <button className="button-green-login" onClick={logOut}>
              Logout
            </button>
          )}
        </div>
        <div/>
      </div>
      <CollapsedSidebar
        logout={logOut}
        setToggle={setToggle}
        toggle={toggle}
        state={state.userState}
      />
    </>
  );
};
