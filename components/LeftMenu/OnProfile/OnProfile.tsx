import React, {useContext} from "react";

// libs
import Link from "next/link";
import cn from "classnames";
import {useRouter} from "next/router";

// components
import {AppContext} from "../../../context/app.context";
import {useLogout} from "../../../hooks/useLogout";
import {routes} from "../../../utils/routes";

const OnProfile: React.FC = () => {
  const router = useRouter();

  const {state} = useContext(AppContext);
  const {isLogged, avatar_url, username, email} = state.userState;

  const [logOut] = useLogout();

  const links = [
    {icon: '../../images/user.svg', title: 'Profile', url: routes.profile},
    {icon: '../../images/gallery.svg', title: 'Gallery', url: routes.gallery},
    {icon: '../../images/more_vert.svg', title: 'Account', url: routes.account},
    {icon: '../../images/person_black_24dp.svg', title: 'View My Profile', url: `${routes.search}/${email ? email : 'exam@exam.exam'}`},
  ];

  return (
    <div>
      <div className="leftmenu">
        <div className="leftmenu-content">
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
            <img className="user-image" src={avatar_url || "../../images/empty_avatar.png"} alt="profile image" />
            <div className="user-description white">
              <span>{username?.split(" ")[0] || ""}</span>
              <span>{username?.split(" ")[1] || ""}</span>
            </div>
          </div>
        </div>
        <div className="leftmenu-navbar">
          {links.map(link => (
            <Link key={link.title} href={link.url}>
              <li className={cn('leftmenu-list', {active: link.url === router.asPath})}>
                <img className="leftmenu-link-image" src={link.icon} alt="link image" />
                <a className="leftmenu-link">{link.title}</a>
              </li>
            </Link>
          ))}
          {isLogged && (<li className="leftmenu-list logout">
            <img className="leftmenu-link-image" src={"../../images/left-arrow.svg"} alt="link image" />
            <a className="leftmenu-link" href={routes.login} onClick={logOut}>
              Logout
            </a>
          </li>)}
        </div>
      </div>
      <div className="leftMenu-imagination-div" />
    </div>
  );
};

export default OnProfile;
