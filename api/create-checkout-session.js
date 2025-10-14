// api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, email } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid donation amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: { name: "Lifewords Donation" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: "https://YOUR-WEBFLOW-SITE/success",
      cancel_url: "https://YOUR-WEBFLOW-SITE/cancel",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
