import React from "react";

// components
import {MenuItem} from "../MenuItem/MenuItem";
import {TopSection} from "../TopSection/TopSection";

const LeftMenuOnDesktop: React.FC = () => {

  return (
    <div>
      <div className="leftmenu">
        <div className="leftmenu-content">
          <TopSection />
        </div>
        <MenuItem />
      </div>
    </div>
  );
};

export default LeftMenuOnDesktop;
