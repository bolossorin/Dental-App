import React, {useState} from "react";

//libs
import Router from "next/router";

// components
import {ProfileBox} from "../common/ProfileBox/ProfileBox";
import {routes} from "../../utils/routes";

// assets
import styles from "./Pricing.module.scss";

export const Pricing = () => {
  const [showMap, setShowMap] = useState(false);
  const handleSwitch = () => setShowMap(!showMap);

  const handleSubmit = () => {
    Router.push(routes.purchase)
  }

  const handleFreeSubmit = () => {
    Router.push(routes.account)
  }

  return (
    <div className='container'>
      <div className={styles.pricingWrapper}>
        <div className={styles.title}>
          <h1>Choose your plan</h1>
          <div className={styles.headerButtons}>
            <p className="switcher-text"
               style={{color: !showMap ? "black" : "GrayText", fontWeight: !showMap ? "bold" : "lighter",}}>
              Yearly
            </p>
            <p className="switcher"
               style={{padding: `4px 4px 4px ${!showMap ? "4px" : "20px"}`}}
               onClick={handleSwitch}>
              <span className="switcher-dot" />
            </p>
            <p className="switcher-text"
               style={{color: showMap ? "black" : "GrayText", fontWeight: showMap ? "bold" : "lighter",}}>
              Monthly
            </p>
          </div>
        </div>
        <div className={styles.pricing}>
          <ProfileBox
            title='Free'
            subTitle='Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt'>
            <div className={styles.inner}>
              <ul>
                <li>Members <span>1</span></li>
                <li>Projects <span>2</span></li>
                <li>Storage <span>3</span></li>
              </ul>
              <div className={styles.buttons}>
                <span>$0.00/month</span>
                <button type='button' className='button-green' onClick={() => handleFreeSubmit()}>Get Free</button>
              </div>
            </div>
          </ProfileBox>
          <ProfileBox
            title='Premium'
            subTitle='Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt'>
            <div className={styles.inner}>
              <ul>
                <li>Members <span>10</span></li>
                <li>Projects <span>20</span></li>
                <li>Storage <span>30</span></li>
              </ul>
              <div className={styles.buttons}>
                <span>$3,000.00/month</span>
                <button type='button' className='button-green' onClick={() => handleSubmit()}>Get Premium</button>
              </div>
            </div>
          </ProfileBox>
        </div>
      </div>
    </div>
  )
}
