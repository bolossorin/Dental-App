import React from "react";

// components
import {AdminDetails} from "./AdminDetails/AdminDetails";
import {PaidSubscriber} from "./PaidSubscriber/PaidSubscriber";
import {PremiumInfo} from "./PremiumInfo/PremiumInfo";
import {ServicesProvided} from "./ServicesProvided/ServicesProvided";

export const AdminSettings: React.FC = () => {
  return (
    <>
      <AdminDetails />
      <ServicesProvided />
      <PaidSubscriber />
      <PremiumInfo />
    </>
  );
};
