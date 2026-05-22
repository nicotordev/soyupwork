import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}

declare global {
  // eslint-disable-next-line no-var
  var stripe: Stripe | undefined;
}

const stripe = global.stripe ?? getStripe();

if (process.env.NODE_ENV !== "production") {
  global.stripe = stripe;
}

export default stripe;
