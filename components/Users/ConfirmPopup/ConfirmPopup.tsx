import React from "react";

// libs
import cn from "classnames";
import {Formik, Form, Field} from "formik";

// assets
import styles from "./ConfirmPopup.module.scss";

type ConfirmPopupProps = {
  handleDeleteUserClick: ({confirm: string}) => void;
  onBtnCloseClick: () => void;
  opened: boolean;
  userEmail: string;
};

const ConfirmPopup: React.FC<ConfirmPopupProps> = (props: ConfirmPopupProps) => {

  const opened = cn({[styles.opened]: props.opened});

  return (
    <div className={cn(styles.overlay, opened)}>
      <div className={styles.content}>
        <h2 className={styles.title}>Warning!</h2>
        <p className={styles.warning}>
          You are going to delete user {props.userEmail}.
        </p>
        <p className={styles.warning}>
          This action is irreversible, you can't recover the account. Please,
          type "delete" to continue
        </p>
        <Formik
          initialValues={{confirm: ""}}
          onSubmit={(values) => {
            props.handleDeleteUserClick({
              confirm: values.confirm,
            });
          }}>
          {({values}) => (
            <Form className={styles.form}>
              <Field name="confirm" type="text" className={styles.input} placeholder='Type "delete"' />
              <button type="submit" className={styles.btnSubmit} disabled={values.confirm !== "delete"}>
                Delete user
              </button>
              <button type="button" className={styles.btnClose} onClick={props.onBtnCloseClick} />
            </Form>)}
        </Formik>
      </div>
    </div>
  );
};

export default ConfirmPopup;
