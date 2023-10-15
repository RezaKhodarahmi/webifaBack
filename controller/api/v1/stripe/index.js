const Transactions = require("../../../../models").Transactions;
const Users = require("../../../../models").Users;

//Convert now date to year-month-day format
const calculateOneYearFromNow = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//Verify payment with stripe webhook
const verifyPayment = async (req, res) => {
  try {
    const eventData = req.body?.data?.object;

    //Check and return  if request is now a event
    if (!eventData) {
      return res.status(200).send("Received");
    }

    //charge use for the courses transaction
    if (eventData.object === "charge" && eventData.status === "succeeded") {
      const transaction = await Transactions.findOne({
        where: { Stripe_Charge_ID: eventData.id },
      });

      if (transaction) {
        transaction.Transaction_Status = eventData.status;
        await transaction.save();
      }
    } else if (
      eventData.object === "payment_intent" &&
      eventData.status === "succeeded"
    ) {
      const user = await Users.findOne({
        where: { stripeCustomerId: eventData.customer },
      });

      if (user) {
        const oldTransaction = await Transactions.findOne({
          where: { Stripe_Charge_ID: eventData.id },
        });

        if (!oldTransaction) {
          user.vip = calculateOneYearFromNow();
          await user.save();

          await Transactions.create({
            userId: user.id,
            courseId: [0],
            cycleId: [0],
            Stripe_Charge_ID: eventData.id,
            Amount: eventData.amount,
            Currency: "CAD",
            Transaction_Date: new Date(),
            Transaction_Status: eventData.status,
            Transaction_Type: "Stripe",
            coupons: null,
          });

          //here add activecamp code
        } else {
          user.vip = calculateOneYearFromNow();
          await user.save();
          oldTransaction.Transaction_Status = eventData.status;
          await oldTransaction.update();
        }
      }
    }
    res.status(200).send("Received");
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { verifyPayment };
