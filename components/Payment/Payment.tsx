import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
import {loadStripe} from "@stripe/stripe-js";
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";
import Router from "next/router";

// components
import {Spinner} from "..";
import {API} from "../../api/AWS-gateway";
import {AppContext} from "../../context/app.context";
import {ISetNotofication} from "../Toast";
import notify from "../Toast";
import {CARD_OPTIONS} from "../../utils/cardOptions";


const getCurrency = (price: number, oldPrice: number) => {
  return new Intl.NumberFormat("en-IN", {style: "currency", currency: "GBP",}).format(price || oldPrice);
};

export const Field = (
  {
    label,
    id,
    type,
    placeholder,
    required,
    autoComplete,
    value,
    onChange,
    disabled,
  }: any) => (
  <div className="col-12 col-xl-6 mt-3 mx-auto">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      className="form-control"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<any>(null);
  const [couponField, showCouponField] = useState<boolean>(false);
  const [couponValue, setCouponValue] = useState<string>("");
  const [couponId, setCouponId] = useState<string>("");
  const [cuponStatus, setCuponStatus] = useState<"success" | "error" | null>(null);
  const [checking, proccessCheckingCupon] = useState<boolean>(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [price, setPrice] = useState({original: 0, withCoupon: 0});

  const {state} = useContext(AppContext);
  const {email, username} = state.userState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const [billingDetails, setBillingDetails] = useState({email: email || "", name: username || "",});

  useEffect(() => {
    (async () => {
      try {
        const {data} = await axios.get(API.STRIPE_GET_PREMIUM_PRICE);
        setPrice({original: data.premiumPrice / 100, withCoupon: 0});
      } catch (exp) {
        setNotification({
          type: "error",
          message: "Error with get price",
          position: "top-right",
        });
      }
    })();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement("card")!.focus();
      return;
    }

    if (cardComplete) setProcessing(true);

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement) as any,
      billing_details: billingDetails,
    });

    if (payload.error) {
      setError(payload.error as any);
      setNotification({
        type: "error",
        message: payload.error.message || "Stripe Error",
        position: "top-right",
      });
      setProcessing(false);
    } else {
      try {
        const body = {
          email: billingDetails.email,
          username: billingDetails.name,
          coupon: couponId || null,
          paymentMethodId: payload.paymentMethod.id,
        };
        const {data} = await axios.post(API.STRIPE_SUBSCRIPTION_CREATE, body);
        if (data.subscription_id) {
          setNotification({
            type: "success",
            message: "Payment Successful! Please wait...",
            position: "top-right",
            autoClose: 3,
          });
        }
        setTimeout(() => {
          Router.push("/dentist/profile");
        }, 3000);

        setPaymentMethod(payload.paymentMethod as any);
      } catch (exp) {
        setNotification({
          type: "error",
          message: "Stripe Subsciption Error",
          position: "top-right",
        });
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleCheckCoupon = async () => {
    if (couponValue.length < 1) return;
    proccessCheckingCupon(true);

    try {
      const body = {coupon: couponValue};
      const {data} = await axios.post(API.STRIPE_CHECK_COUPON, body);
      if (!data) return false;

      setCuponStatus("success");
      setCouponId(data.coupon);
      const cost = price.original - (price.original * data.percent_off) / 100;
      setPrice(({original}) => ({original, withCoupon: cost}));
      setNotification({
        type: "success",
        message: `Coupon with bonus -${data.percent_off}%`,
        position: "top-right",
      });
      proccessCheckingCupon(false);
    } catch (exp) {
      console.error(exp, 'error');
      setCuponStatus("error");
      setNotification({
        type: "error",
        message: "Coupon not found!",
        position: "top-right",
      });
      proccessCheckingCupon(false);
    } finally {
      proccessCheckingCupon(false);
    }
  };

  const handleCouponChange = (e: any) => {
    setCouponValue(e.target.value);
    if (couponValue.length <= 1) setCuponStatus(null);
  };

  const handleCouponKeydown = (e: any) => {
    if (e.key === "Enter") handleCheckCoupon();

    if (e.key === "Backspace" || e.key === "Delete" || ((e.ctrlKey || e.metaKey) && e.keyCode == 88)) {
      setPrice(({original}) => ({
        original,
        withCoupon: 0,
      }));
      setCuponStatus(null);
    }
  };

  return paymentMethod && !processing ? (<img src={"../../images/Payment-success.png"} alt="pay_image" />)
    : (<form className="Form" onSubmit={handleSubmit}>
        <fieldset className="FormGroup">
          <Field
            label="Name"
            id="name"
            type="text"
            placeholder="Jane Doe"
            required
            disabled={checking || processing}
            autoComplete="name"
            value={billingDetails.name}
            onChange={(e: any) => {
              setBillingDetails({...billingDetails, name: e.target.value});
            }} />
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="janedoe@gmail.com"
            required
            disabled={checking || processing}
            autoComplete="email"
            value={billingDetails.email}
            onChange={(e: any) => setBillingDetails({...billingDetails, email: e.target.value})} />
        </fieldset>
        <fieldset className="FormGroup">
          <div className="col-12 col-xl-6 mx-auto mt-3">
            <CardElement
              options={CARD_OPTIONS as any}
              onChange={(e: any) => {
                setError(e.error);
                setCardComplete(e.complete);
              }} />
          </div>
        </fieldset>
        {error && <div className="form-text col-12 col-xl-6 mx-auto" role="alert">
          <svg width="16" height="16" viewBox="0 0 17 17">
            <path
              fill="#FFF"
              d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z" />
            <path
              fill="#6772e5"
              d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
            />
          </svg>
          {error.message as any}
        </div>}
        <div className="col-12 col-xl-6 mx-auto mt-3" style={{display: "flex", justifyContent: "space-between"}}>
          <button
            className={`btn btn-success ${error ? "btn btn btn-danger" : ""}`}
            type="submit"
            disabled={processing || (!stripe || checking)}>
            {processing ? <Spinner /> : `Pay ${getCurrency(price.withCoupon, price.original)}`}
          </button>
          {couponField ? (
            <div id="coupon_input_container">
              <input
                type="text"
                id="coupon_input"
                disabled={checking || processing}
                value={couponValue}
                autoComplete="Coupon"
                placeholder={"Coupon"}
                onChange={handleCouponChange}
                onKeyDown={handleCouponKeydown} />
              <div style={{cursor: "pointer",}}>
                {!cuponStatus && !checking && (
                  //toDo add icon **CachedRoundedIcon**
                  <div
                    color="inherit"
                    style={{margin: "0 5px 0 5px"}}
                    onClick={handleCheckCoupon}
                  >
                    <img src={"../../images/repeat.svg"} width={20} alt="" />
                  </div>
                )}
                {!cuponStatus && checking && (
                  //todo add icon **CircularProgress**
                  <div style={{margin: "0 5px 0 5px"}}>
                    <Spinner />
                  </div>
                )}
                {cuponStatus === "success" && (
                  //toDo add icon **DoneAllRoundedIcon**
                  <div style={{margin: "0 5px 0 5px"}}>
                    <img
                      src={"../../images/success-green-check-mark.svg"}
                      width={24}
                      alt=""
                    />
                  </div>
                )}
                {cuponStatus === "error" && (
                  //todo add icon **ErrorRoundedIcon**
                  <div style={{margin: "0 5px 0 5px"}}>
                    <img src={"../../images/cross.svg"} width={20} alt="" />
                  </div>
                )}
              </div>
            </div>
          ) : (<button
              className={`btn btn-success ${error ? "btn btn btn-danger" : ""}`}
              type="submit"
              disabled={checking || processing}
              onClick={() => showCouponField(true)}>
              Add promotion code
            </button>
          )}
        </div>
      </form>
    );
};

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto",
    },
  ],
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(`${process.env.STRIPE_PK_KEY}`);

export interface ICheckoutForm {
  username: string;
  onSubmit: () => void;
  onCancel: () => void;
  setNotification: ISetNotofication;
}

const Payment = () => {
  return (
    <div className="AppWrapper col-12 col-xl-8 mx-auto">
      <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Payment;
