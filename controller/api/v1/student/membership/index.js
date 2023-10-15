const Users = require("../../../../../models").Users;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const buyVipMembership = async (req, res) => {
  try {
    const email = req.params.email; // You might want to dynamically fetch this based on the authenticated user
    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).send("User not found");
    }

    let customer;

    // Check if user has a Stripe customer ID, if not, create one
    if (!user.stripeCustomerId) {
      customer = await stripe.customers.create({ email: email });

      // Update user with Stripe customer ID for future reference
      user.stripeCustomerId = customer.id;
      await user.save();
    } else {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    }

    // Create checkout session for the customer
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_MEMBERSHIP_PRICE_ID,
          quantity: 1,
        },
      ],

      mode: process.env.STRIPE_PRODUCT_PAYMENT_MODE,
      success_url: `${process.env.APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/cancel-vip`,
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { buyVipMembership };
