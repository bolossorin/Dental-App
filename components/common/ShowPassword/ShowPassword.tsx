import React from "react";

export const ShowPassword = ({isPassHidden, setIsPassHidden}) => {
  return (
    <>
      {!isPassHidden && (<img
        className="form-login-input-eye"
        src={"../images/eye-blocked.svg"}
        onClick={() => setIsPassHidden(true)}
        alt='' />)}
      {isPassHidden && (<img
        className="form-login-input-eye"
        src={"../images/eye.svg"}
        onClick={() => setIsPassHidden(false)}
        alt='' />)}
    </>
  )
}
