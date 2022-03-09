import Link from "next/link";
import { TUserReducerState } from "../../../reducers";

interface ICollapsedSidebarProps {
  logout: () => Promise<void>;
  setToggle: (status: boolean) => void;
  toggle: boolean;
  state: TUserReducerState;
}

export const CollapsedSidebar: React.FC<ICollapsedSidebarProps> = ({
  logout,
  setToggle,
  toggle,
  state,
}) => {
  const { username, avatar_url, email } = state;
  return (
    <div
      id="myNav"
      className="overlay"
      style={{ width: !!toggle ? "330px" : "0" }}
    >
      <div className="overlay-content">
        <div className="leftmenuCollapsed">
          <div className="leftmenuCollapsed-content">
            <img
              className="form-login-input-close overlay_closebtn"
              src="../../images/close.svg"
              onClick={() => {
                setToggle(false);
              }}
            />
            <div className="link-actve">
              <Link href="/">
                <img
                  src="../../images/FYD4_beige-on-green@2x.png"
                  srcSet="../../images/FYD4_beige-on-green@2x.png 2x, ../../images/FYD4_beige-on-green@3x.png 3x"
                  className="logo-image desctop-visible"
                  alt="logo image"
                />
              </Link>
            </div>
            <div className="leftmenu-user-information">
              <img
                className="user-image"
                src={avatar_url || "../../images/empty_avatar.png"}
                alt="profile image"
              />
              <div className="user-description white">
                <span>{username?.split(" ")[0] || ""}</span>
                <span>{username?.split(" ")[1] || ""}</span>
              </div>
            </div>
          </div>
          <div className="leftmenu-navbar">
            <Link href={`../dentist/profile/`}>
              <li className={`leftmenu-list active}`}>
                <img
                  className="leftmenu-link-image"
                  src="../../images/user.svg"
                  alt="link image"
                />
                <a className="leftmenu-link">Profile</a>
              </li>
            </Link>
            <Link href={`../../dentist/gallery/`}>
              <li className={`leftmenu-list`}>
                <img
                  className="leftmenu-link-image"
                  src="../../images/gallery.svg"
                  alt="link image"
                />
                <a className="leftmenu-link">Gallery</a>
              </li>
            </Link>
            <Link href={`../../dentist/account/`}>
              <li className={`leftmenu-list`}>
                <img
                  className="leftmenu-link-image"
                  src="../../images/more_vert.svg"
                  alt="link image"
                />
                <a className="leftmenu-link">Account</a>
              </li>
            </Link>
            <Link href={`../../search/${email}`}>
              <li className={`leftmenu-list`}>
                <img
                  className="leftmenu-link-image"
                  src="../../images/person_black_24dp.svg"
                  alt="link image"
                />
                <a className="leftmenu-link">View My Profile</a>
              </li>
            </Link>
            <li className="leftmenu-list logout">
              <img
                className="leftmenu-link-image"
                src="../../images/left-arrow.svg"
                alt="link image"
              />
              <a
                className="leftmenu-link"
                href="#"
                onClick={async () => {
                  await logout();
                }}
              >
                Logout
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};
