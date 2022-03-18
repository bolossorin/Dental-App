import React from "react";

// libs
import Link from "next/link";

// components
import {TUserReducerState} from "../../../reducers";
import {routes} from "../../../utils/routes";
import cn from "classnames";
import {useRouter} from "next/router";

interface ICollapsedSidebarProps {
  logout: () => Promise<void>;
  setToggle: (status: boolean) => void;
  toggle: boolean;
  state: TUserReducerState;
}

export const OnHeader: React.FC<ICollapsedSidebarProps> = ({logout, setToggle, toggle, state}) => {
  const router = useRouter();

  const {username, avatar_url, email} = state;

  const links = [
    {icon: '../../images/user.svg', title: 'Profile', url: routes.profile},
    {icon: '../../images/gallery.svg', title: 'Gallery', url: routes.gallery},
    {icon: '../../images/more_vert.svg', title: 'Account', url: routes.account},
    {icon: '../../images/person_black_24dp.svg', title: 'View My Profile', url: `${routes.search}/${email ? email : 'exam@exam.exam'}`},
  ];

  return (
    <div id="myNav" className="overlay" style={{width: toggle ? "330px" : "0"}}>
      <div className="overlay-content">
        <div className="leftmenuCollapsed">
          <div className="leftmenuCollapsed-content">
            <img
              className="form-login-input-close overlay_closebtn"
              src={"../../images/close.svg"}
              onClick={() => setToggle(false)} alt='' />
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
              <img
                className="user-image"
                src={avatar_url || "../../images/empty_avatar.png"}
                alt="profile image" />
              <div className="user-description white">
                <span>{username?.split(" ")[0] || ""}</span>
                <span>{username?.split(" ")[1] || ""}</span>
              </div>
            </div>
          </div>
          <div className="leftmenu-navbar">
            {links.map(link => (
              <Link href={link.url}>
                <li className={cn('leftmenu-list', {'active': link.url === router.asPath})}>
                  <img className="leftmenu-link-image" src={link.icon} alt="link image" />
                  <a className="leftmenu-link">{link.title}</a>
                </li>
              </Link>
            ))}
            <li className="leftmenu-list logout">
              <img className="leftmenu-link-image" src={"../../images/left-arrow.svg"} alt="link image" />
              <a className="leftmenu-link" href="#" onClick={async () => await logout()}>
                Logout
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};
