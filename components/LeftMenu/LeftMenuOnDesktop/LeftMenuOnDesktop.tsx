import React from "react";

// components
import {Null_Or_} from "../../../reducers/types";
import {MenuItem} from "../MenuItem/MenuItem";
import {TopSection} from "../TopSection/TopSection";

interface IMenu {
  adminMenu: Null_Or_<boolean>;
}

const LeftMenuOnDesktop: React.FC<IMenu> = ({adminMenu = null}) => {

  return (
    <div>
      <div className="leftmenu">
        <div className="leftmenu-content">
          <TopSection />
        </div>
        <MenuItem adminMenu={adminMenu} />
      </div>
    </div>
  );
};

export default LeftMenuOnDesktop;
