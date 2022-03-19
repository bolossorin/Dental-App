import React, {DetailedHTMLProps, InputHTMLAttributes} from "react";

// libs
import {Field} from "formik";


interface ISwitchProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onColor?: string;
  name: string;
  values: any;
}

export const Switch = (({onColor, name, values}: ISwitchProps): JSX.Element => {
    return (
      <>
        <Field
          name={name}
          type='checkbox'
          className="react-switch-checkbox"
          id={name} />
        <label
          style={{background: values[name] ? onColor : ""}}
          className="react-switch-label"
          htmlFor={name}>
          <span className={`react-switch-button`} />
        </label>
      </>
    );
  }
);
