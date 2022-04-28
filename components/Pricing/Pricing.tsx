import React, {useEffect, useState} from "react";

//libs
import Router from "next/router";
import {get} from "lodash";

// components
import {ProfileBox} from "../common/ProfileBox/ProfileBox";
import {routes} from "../../utils/routes";
import {getSettingsSubscriptionsApi} from "../../api/AWS-gateway";

// assets
import styles from "./Pricing.module.scss";

export const Pricing = () => {
  const [showMap, setShowMap] = useState(false);
  const [settings, setSettings] = useState<any>({premium: {}, free: {}});

  const handleSwitch = () => setShowMap(!showMap);

  const handleSubmit = () => Router.push(routes.purchase);

  const handleFreeSubmit = () => Router.push(routes.account);

  useEffect(() => {
    getSettingsSubscriptionsApi()
      .then(({data}) => {
          const free = data.filter((item) => item.subscription_type === 'FREE');
          const premium = data.filter((item) => item.subscription_type === 'PREMIUM');
          setSettings({premium: premium[0], free: free[0]})
        }
      )
      .catch((error) => console.log(error, 'error'));
  }, []);

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
                <li>Max Locations <span>{get(settings, 'free.maxLocations', '')}</span></li>
                <li>Max Services <span>{get(settings, 'free.maxService', '')}</span></li>
                {get(settings, 'free.websiteAllowed', '') && <li>Website Address</li>}
                {get(settings, 'free.phoneAllowed', '') && <li>Phone Number</li>}
                {get(settings, 'free.appearVerifiedAllowed', '') && <li>Appear Verified</li>}
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
                <li>Max Locations <span>{get(settings, 'premium.maxLocations', '')}</span></li>
                <li>Max Services <span>{get(settings, 'premium.maxService', '')}</span></li>
                {get(settings, 'premium.websiteAllowed', '') && <li>Website Address</li>}
                {get(settings, 'premium.phoneAllowed', '') && <li>Phone Number</li>}
                {get(settings, 'premium.appearVerifiedAllowed', '') && <li>Appear Verified</li>}
                <li>Watermark</li>
                <li>Verified Badge</li>
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
