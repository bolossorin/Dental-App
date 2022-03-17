import React, {useCallback, useState} from "react";

// libs
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";
import Router from "next/router";
import {Formik, Field, Form} from "formik";

// components
import {Spinner} from "../../";
import {API} from "../../../api/AWS-gateway";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {CARD_OPTIONS} from "../../../utils/cardOptions";
import * as Yup from "yup";
import cn from "classnames";

const getCurrency = (price: number, oldPrice: number) => {
  return new Intl.NumberFormat("en-IN", {style: "currency", currency: "GBP",}).format(price || oldPrice);
};

const stripeCheckoutSchema = Yup.object().shape({
  name: Yup.string().matches(/^([A-Za-z]){1,28}$/, 'Invalid name').required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});
export const StripeForm = ({backButton, setNextStep}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<any>(null);
  const [couponField, showCouponField] = useState<boolean>(false);
  const [couponValue, setCouponValue] = useState<string>("");
  const [couponId, setCouponId] = useState<string>("");
  const [couponStatus, setCouponStatus] = useState<"success" | "error" | null>(null);
  const [checking, processCheckingCoupon] = useState<boolean>(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [price, setPrice] = useState({original: 120, withCoupon: 0});

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const handleCheckCoupon = async () => {
    if (couponValue.length < 1) return;
    processCheckingCoupon(true);

    try {
      const body = {coupon: couponValue};
      const {data} = await axios.post(API.STRIPE_CHECK_COUPON, body);
      if (!data) return false;

      setCouponStatus("success");
      setCouponId(data.coupon);
      const cost = price.original - (price.original * data.percent_off) / 100;
      setPrice(({original}) => ({original, withCoupon: cost}));
      setNotification({
        type: "success",
        message: `Coupon with bonus -${data.percent_off}%`,
      });
      processCheckingCoupon(false);
    } catch (exp) {
      console.error(exp, 'error');
      setCouponStatus("error");
      setNotification({
        type: "error",
        message: "Coupon not found!",
      });
      processCheckingCoupon(false);
    } finally {
      processCheckingCoupon(false);
    }
  };

  const handleCouponChange = (e: any) => {
    setCouponValue(e.target.value);
    if (couponValue.length <= 1) setCouponStatus(null);
  };

  const handleCouponKeydown = (e: any) => {
    if (e.key === "Enter") handleCheckCoupon();

    if (e.key === "Backspace" || e.key === "Delete" || ((e.ctrlKey || e.metaKey) && e.keyCode == 88)) {
      setPrice(({original}) => ({original, withCoupon: 0}));
      setCouponStatus(null);
    }
  };

  return <Formik
    validationSchema={stripeCheckoutSchema}
    initialValues={{name: '', email: ''}}
    onSubmit={async (values) => {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        setNotification({type: "error", message: "Stripe Error..."});
        return;
      }

      if (error) {
        elements.getElement("card")!.focus();
        setNotification({type: "error", message: "Stripe Error..."});
        return;
      }

      if (cardComplete) setProcessing(true);

      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement) as any,
        billing_details: values,
      });

      if (payload.error) {
        setError(payload.error as any);
        setNotification({
          type: "error",
          message: payload.error.message || "Stripe Error",
        });
        setProcessing(false);
      } else {
        try {
          const body = {
            email: values.email,
            username: values.name,
            coupon: couponId || null,
            paymentMethodId: payload.paymentMethod.id,
          };

          const {data} = await axios.post(API.STRIPE_SUBSCRIPTION, body);

          if (data.subscription_id) {
            setNotification({
              type: "success",
              message: "Payment Successful! Please wait...",
              autoClose: 3,
            });
          }

          setTimeout(() => {
            Router.push("/dentist/profile");
          }, 3000);

        } catch (exp) {
          setNotification({
            type: "error",
            message: "Stripe Subscription Error",
          });
        } finally {
          setProcessing(false);
        }
      }
    }}>
    {({errors, touched}) =>
      (<Form className="form-login stripe-checkout">
        <p className="form-login-title green px20">Purchase subscription</p>
        <p className="form-login-subtitle gray">Current FYD users</p>
        <div className="form-login-input">
          <Field name='name' label="Name" placeholder="Name" autoComplete="name" />
          {errors.name && touched.name ? (<div className='errorMessage'>{errors.name}</div>) : null}
        </div>
        <div className="form-login-input">
          <Field type='email' name='email' placeholder='Email' />
          {errors.email && touched.email ? (<div className='errorMessage'>{errors.email}</div>) : null}
        </div>
        <div className="form-login-input">
          <div className='stripe-cart'>
            <CardElement
              options={CARD_OPTIONS as any}
              onChange={(e: any) => {
                setError(e.error);
                setCardComplete(e.complete);
              }} />
          </div>
        </div>
        <div className="form-login-input">
          <div className='stripe-buttons'>
            <button
              className={cn("btn btn-success", {"btn btn btn-danger": error})}
              type="submit"
              disabled={processing || (!stripe || checking)}>
              {processing ? <Spinner /> : `Pay ${getCurrency(price.withCoupon, price.original)}`}
            </button>
            {couponField ? (<div id="coupon_input_container">
                <Field
                  type="text"
                  disabled={checking || processing}
                  value={couponValue}
                  autoComplete="Coupon"
                  placeholder={"Coupon"}
                  onChange={handleCouponChange}
                  onKeyDown={handleCouponKeydown} />
                <div className='coupon-wrapper-icon'>
                  {!couponStatus && !checking && (<div className='coupon-icon' onClick={handleCheckCoupon}>
                    <img src={"../../images/repeat.svg"} width={20} alt="" />
                  </div>)}
                  {!couponStatus && checking && (<div className='coupon-icon'><Spinner /></div>)}
                  {couponStatus === "success" && (<div className='coupon-icon'>
                    <img src={"../../images/success-green-check-mark.svg"} width={24} alt="" />
                  </div>)}
                  {couponStatus === "error" && (<div className='coupon-icon'>
                    <img src={"../../images/cross.svg"} width={20} alt="" />
                  </div>)}
                </div>
              </div>)
              : <button
                className={`btn btn-success ${error ? "btn btn btn-danger" : ""}`}
                type="submit"
                disabled={checking || processing}
                onClick={() => showCouponField(true)}>
                Add promotion code
              </button>}
          </div>
        </div>
        {backButton && <div className="form-login-input">
          <button type="button" className="button-Back mt-0" onClick={() => setNextStep("register")}>Back</button>
        </div>}
      </Form>)}
  </Formik>
}
