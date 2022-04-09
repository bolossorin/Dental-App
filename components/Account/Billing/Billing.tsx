import React from "react";

// components
import {StripeCheckout} from "../../stripe/StripeCheckout/StripeCheckout";

export const Billing = () => {
  return (
    <div className="account-profile-block-box billing">
      <div className="account-form-profile-label">
        <label className="account-form-profile-label">Billing Information</label>
      </div>
      <StripeCheckout />
    </div>
  )
}
