import React from "react";

// libs
import cn from "classnames";
import {Formik, Form, Field} from "formik";

// assets
import styles from "./ConfirmPopup.module.scss";

type ConfirmPopupProps = {
  handleUserClick: () => void;
  onBtnCloseClick: () => void;
  opened: boolean;
  userGDC: string;
  type: string;
};

const ConfirmPopup: React.FC<ConfirmPopupProps> = (props: ConfirmPopupProps) => {

  const opened = cn({[styles.opened]: props.opened});

  return (
    <div className={cn(styles.overlay, opened)}>
      <div className={styles.content}>
        <h2 className={styles.title}>Warning!</h2>
        <p className={styles.warning}>
          You are going to {props.type} user {props.userGDC}.
        </p>
        {props.type === "delete" && <p className={styles.warning}>
          This action is irreversible, you can't recover the account. Please,
          type "delete" to continue
        </p>}
        <Formik
          initialValues={{confirm: ""}}
          onSubmit={(values, {resetForm}) => {
            props.handleUserClick();
            props.onBtnCloseClick();
            resetForm();
          }}>
          {({values}) => (
            <Form className={styles.form}>
              <Field name="confirm" type="text" className={styles.input} placeholder={`Type "${props.type}"`} />
              <button type="submit" className={styles.btnSubmit} disabled={values.confirm !== `${props.type}`}>
                {props.type.toUpperCase()} user
              </button>
              <button type="button" className={styles.btnClose} onClick={props.onBtnCloseClick} />
            </Form>)}
        </Formik>
      </div>
    </div>
  );
};

export default ConfirmPopup;
