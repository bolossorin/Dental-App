import React from "react";
import {Header} from "../components";
import PaymentContent from "../components/payment";
import {Footer} from "../components/Footer/Footer";

const Payment = (): JSX.Element => {
  return (
    <>
      <section>
        <Header />
        {/* payment */}
        <>
          <div
            className="main-profile bg-white biling"
            style={{minHeight: "unset", maxHeight: "unset"}}
          >
            <div className="profile-box-form">
              <div className="form-info-block">
                <div>
                  <p className="form-login-title green px20">
                    Purchase subscription
                  </p>
                  <p className="form-login-subtitle gray px12 mb-6px" />
                </div>
              </div>
              <div
                className="box-to-box "
                style={{marginTop: "-20px", marginBottom: "10%"}}
              >
                <PaymentContent />
              </div>
            </div>
          </div>
        </>
        <Footer />
      </section>
    </>
  );
};

export default Payment;
