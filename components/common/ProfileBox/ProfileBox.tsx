import React from "react";

export const ProfileBox = ({title, subTitle, children}) => {
  return (
    <div className="account-profile-box-form">
      <div className="account-form-info-block-full">
        <div>
          <p className="account-form-login-title">{title}</p>
          <p className="account-form-login-subtitle">{subTitle}</p>
        </div>
      </div>
      <div className="account-box-2-box">
        {children}
      </div>
    </div>
  )
}
