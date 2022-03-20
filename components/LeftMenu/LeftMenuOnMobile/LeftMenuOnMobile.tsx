import React from "react";

// components
import {MenuItem} from "../MenuItem/MenuItem";
import {Null_Or_} from "../../../reducers/types";
import {TopSection} from "../TopSection/TopSection";

interface ICollapsedSidebarProps {
  setToggle: (status: boolean) => void;
  toggle: boolean;
  adminMenu: Null_Or_<boolean>;
}

export const LeftMenuOnMobile: React.FC<ICollapsedSidebarProps> = ({setToggle, toggle, adminMenu}) => {

  return (
    <div id="myNav" className="overlay" style={{width: toggle ? "330px" : "0"}}>
      <div className="overlay-content">
        <div className="leftmenuCollapsed">
          <div className="leftmenuCollapsed-content">
            <img
              className="form-login-input-close overlay_closebtn"
              src={"../../images/close.svg"}
              onClick={() => setToggle(false)} alt='' />
            <TopSection />
          </div>
          <MenuItem adminMenu={adminMenu} />
        </div>
      </div>
    </div>
  );
};
