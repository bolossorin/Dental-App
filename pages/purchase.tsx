import React from "react";

// components
import {Header} from "../components";
import PaymentContent from "../components/Payment/Payment";
import {Footer} from "../components/Footer/Footer";

const Payment = (): JSX.Element => {
  return (
    <>
      <Header />
      <main className="main-profile bg-white biling" style={{minHeight: "unset", maxHeight: "unset"}}>
        <div className="profile-box-form">
          <p className="form-login-title green px20">Purchase subscription</p>
          <div className="box-to-box " style={{marginTop: "-20px", marginBottom: "10%"}}>
            <PaymentContent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Payment;
