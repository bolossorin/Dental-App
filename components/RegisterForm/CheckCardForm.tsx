import React, {useState, useEffect} from "react";

// libs
import {loadStripe, StripeCardElement} from "@stripe/stripe-js";
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {ToastContainer, toast} from "react-toastify";
import axios from "axios";

// components
import {Spinner} from "../index";
import {API} from "../../api/AWS-gateway";
import {ISetNotofication} from "../Toast";
import {expHandler} from "../../utils/exeptionHandler";
import {CARD_OPTIONS} from "../../utils/cardOptions";
import {Field} from "../Payment/Payment";


const CheckoutForm: React.FC<ICheckoutForm> = (
  {
    username,
    onSubmit,
    onCancel,
    setNotification,
  }) => {

  useEffect(() => {
    const text =
      "To combat fraud, we will verify your card by completing a transaction";
    toast.warning(text, {
      position: "bottom-right",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<any>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({name: ""});

  const stripeTokenHandler = async (token: any) => {
    const amount = 50;
    const currency = "GBP";
    const tokenId = token.id;
    const lambdaUrl = API.STRIPE_CHARGE;
    const bodyParams = {amount: amount, token: tokenId, currency: currency};
    try {
      const response = await axios.post(lambdaUrl, bodyParams);
      return response.data.data.charge_id;
    } catch (exp: any) {
      const message = expHandler(exp);
      setNotification({type: "error", message});
    }
  };

  const stripeRefunder = async (chargeId: string) => {
    const lambdaUrl = API.STRIPE_REFUND;
    const bodyParams = {charge_id: chargeId};
    try {
      const response = await axios.post(lambdaUrl, bodyParams);
      return response.data;
    } catch (exp: any) {
      const message = expHandler(exp);
      setNotification({type: "error", message});
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (username !== billingDetails.name) {
      setNotification({type: "error", message: `Invalid cardholder's name`});
      return;
    }

    if (!stripe || !elements) {
      setNotification({type: "error", message: "Stripe Error..."});
      return;
    }

    const cardElement = elements.getElement(CardElement) as StripeCardElement;
    // use stripe.createToken to get a unique token for the card
    const {error: cardError, token} = await stripe.createToken(cardElement);

    if (error) {
      elements!.getElement("card")!.focus();
      setNotification({type: "error", message: "Stripe Error..."});
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement) as any,
      billing_details: billingDetails,
    });

    if (payload.error) {
      setError(payload.error as any);
    } else {
      if (!cardError) {
        try {
          const chargeId = await stripeTokenHandler(token);
          const refund = await stripeRefunder(chargeId);
          if (refund) {
            onSubmit();
          }
        } catch (exp) {
          setNotification({type: "error", message: "Stripe Error..."});
        } finally {
          setProcessing(false);
        }
      } else {
        setNotification({type: "error", message: "Stripe Error..."});
        setProcessing(false);
        return;
      }
    }
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <fieldset className="FormGroup">
        <Field
          label="Name"
          id="name"
          type="text"
          placeholder="Jane Doe"
          required
          autoComplete="name"
          value={billingDetails.name}
          onChange={(e: any) => {
            setBillingDetails({...billingDetails, name: e.target.value});
          }} />
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
            d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
          />
          <path
            fill="#6772e5"
            d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
          />
        </svg>
        {error.message as any}
      </div>}
      <div
        className="col-12 col-xl-6 mx-auto mt-3"
        style={{display: "flex", justifyContent: "space-between"}}>
        <button
          type="submit"
          disabled={processing || !stripe}
          className="button-SubmitRegister">
          {processing ? <Spinner /> : 'Submit'}
        </button>
      </div>
      <button
        type='button'
        className="button-Back"
        style={{cursor: "pointer"}}
        disabled={processing}
        onClick={() => onCancel()}>
        Back
      </button>
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

const ValidateCard: React.FC<ICheckoutForm> = (props) => {
  return (
    <div className="AppWrapper col-12 col-xl-8 mx-auto">
      <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
        <CheckoutForm {...props} />
      </Elements>
      <ToastContainer />
    </div>
  );
};

export default ValidateCard;
