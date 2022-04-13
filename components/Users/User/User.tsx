import React, {useState} from "react";

// libs
import cn from "classnames";

// assets
import styles from "./User.module.scss";
import moment from "moment";
import {routes} from "../../../utils/routes";

interface UserProps {
  username: string;
  created_at: any;
  subscription_end_date: number;
  subscription_plan: string;
  email: string;
  gdc_number: string;
  post_code: string;
  auth_time: string | null;
  subscription_id: string | null;
  handleSuspendUserClick: ({email: string}) => void;
  openConfirmPopup: ({email: string}) => void;
}

export const User: React.FC<UserProps> = (props: UserProps) => {
  const [opened, setOpened] = useState(false);

  const creationDate = props.created_at.toString().split("/").reverse().join("/");

  const theme = cn({[styles.default]: !opened, [styles.green]: opened});

  const visibility = cn({[styles.hidden]: !opened, [styles.visible]: opened});

  const svgColor = cn({[styles.svg_white]: opened});

  return (
    <li className={cn(styles.userItem, theme)}>
      <section className={cn(styles.user, theme)}>
        <span className={cn(styles.text, theme)}>{props.username}</span>
        <span className={cn(styles.text, theme)}>{creationDate}</span>
        {props.subscription_plan === "PREMIUM" && (<span className={cn(styles.text, theme)}>
            Paid Subscription Ends: {moment.unix(props.subscription_end_date).format("MM/DD/YYYY")}
          </span>)}
        {props.subscription_plan === "FREE" && (<span className={cn(styles.text, theme)}>Account is free</span>)}
        <a href={`${routes.search}/${props.email}`} target='_blank' className={cn(styles.link, styles.text, theme)}>
          <img className={svgColor} src={"../images/user.svg"} alt='' />
          <span>View Profile</span>
        </a>
        <button
          className={cn(styles.link, styles.openBtn, theme)}
          onClick={() => setOpened(!opened)}>
          {!opened && (<img className={cn(styles.openBtn_img, svgColor)} src={"../images/plus.svg"} alt='' />)}
          {opened && (<img className={cn(styles.openBtn_img, svgColor)} src={"../images/minus.svg"} alt='' />)}
        </button>
      </section>
      <section className={cn(styles.userDetails, visibility, theme)}>
        <div className={styles.userInfo}>
          <span className={styles.key}>Account Email:</span>
          <span className={styles.value}>{props.email}</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.key}>GDC Number:</span>
          <span className={styles.value}>{props.gdc_number}</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.key}>Post Code:</span>
          <span className={styles.value}>{props.post_code}</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.key}>Last Logged In:</span>
          <span className={styles.value}>{props.auth_time}</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.key}>Subscription #:</span>
          <span className={styles.value}>{props.subscription_id}</span>
        </div>
        <div className={styles.buttons}>
          <div className={styles.btnWrap}>
            <button
              type="button"
              className={styles.suspendDeleteBtn}
              onClick={() => props.handleSuspendUserClick({email: props.email})}>
              Suspend
            </button>
          </div>
          <div className={styles.btnWrap}>
            <button
              type="button"
              className={styles.suspendDeleteBtn}
              onClick={() => props.openConfirmPopup({email: props.email})}>
              Delete
            </button>
          </div>
        </div>
      </section>
    </li>
  );
};
