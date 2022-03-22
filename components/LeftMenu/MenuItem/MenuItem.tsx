import React, {useContext, useEffect, useState} from "react";

// libs
import Link from "next/link";
import cn from "classnames";
import {useRouter} from "next/router";

// components
import {routes} from "../../../utils/routes";
import {useLogout} from "../../../hooks/useLogout";
import {AppContext} from "../../../context/app.context";


interface ILinks {
  icon: string;
  title: string;
  url: string;
}

export const MenuItem = () => {
  const router = useRouter();
  const [links, setLinks] = useState<ILinks[]>([]);
  const [loginUrl, setLoginUrl] = useState(routes.login);

  const {state} = useContext(AppContext);
  const {isLogged, email} = state.userState;
  const {isLoggedAdmin} = state.adminState;

  const [logOut] = useLogout();

  useEffect(() => {
    const dentistLinks = [
      {icon: '../../images/user.svg', title: 'Profile', url: routes.profile},
      {icon: '../../images/gallery.svg', title: 'Gallery', url: routes.gallery},
      {icon: '../../images/more_vert.svg', title: 'Account', url: routes.account},
      {
        icon: '../../images/person_black_24dp.svg',
        title: 'View My Profile',
        url: `${routes.search}/${email ? email : 'exam@exam.exam'}`
      },
    ];

    const adminLinks = [
      {icon: '../../images/dashboard.svg', title: 'Dashboard', url: routes.dashboard},
      {icon: '../../images/user.svg', title: 'Users', url: routes.users},
      {icon: '../../images/more_vert.svg', title: 'Settings', url: routes.settings},
    ];

    if (isLogged) {
      setLinks(dentistLinks)
      setLoginUrl(routes.login)
    } else if (isLoggedAdmin) {
      setLinks(adminLinks)
      setLoginUrl(routes.loginAdmin)
    }

  }, [isLogged, isLoggedAdmin, email])

  return (
    <div className="leftmenu-navbar">
      {links.length > 0 && links.map(link => (
        <Link key={link.title} href={link.url}>
          <li className={cn('leftmenu-list', {active: link.url === router.asPath})}>
            <img className="leftmenu-link-image" src={link.icon} alt="link image" />
            <a className="leftmenu-link">{link.title}</a>
          </li>
        </Link>))}
      {(isLogged || isLoggedAdmin) && <li className="leftmenu-list logout">
        <img className="leftmenu-link-image" src={"../../images/left-arrow.svg"} alt="link image" />
        <a className="leftmenu-link" href={loginUrl} onClick={logOut}>
          Logout
        </a>
      </li>}
    </div>
  )
}
