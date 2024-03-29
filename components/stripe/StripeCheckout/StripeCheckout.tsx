// libs
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

// components
import {StripeForm} from "../StripeForm/StripeForm";
import {ELEMENTS_OPTIONS} from "../../../utils/cardOptions";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PK_KEY}`);

export const StripeCheckout = ({setSubscriptionPlan}) => {
    return (
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
            <StripeForm setSubscriptionPlan={setSubscriptionPlan} />
        </Elements>
    );
};
