const Coupon = require("../../../../../models").Coupon;
const Referral = require("../../../../../models").Referral;
const Users = require("../../../../../models").Users;

//Inputs validation
const Validation = require("../../../../../utils/dashboard/validationSchema");

const verifyCoupon = async (req, res) => {
  try {
    const params = req.body;
    const { err } = Validation.checkCouponBodyValidation(params);
    if (err) {
      return res.status(401).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const dateNow = new Date();

    const existedCoupon = await Coupon.findOne({
      where: { code: params.coupon },
    });

    if (!existedCoupon) {
      return res.status(401).json({
        error: true,
        message: "Coupon not found!",
      });
    }

    const expiresDate = new Date(existedCoupon.expires_at);

    if (expiresDate && expiresDate.getTime() <= dateNow.getTime()) {
      return res.status(401).json({
        error: true,
        message: "Coupon is expired!",
      });
    }
    const allowedCourses = existedCoupon.course_id || [];
    if (
      allowedCourses.length &&
      !params.cycles.some((cycle) => allowedCourses.includes(cycle.courseId))
    ) {
      return res.status(401).json({
        error: true,
        message: "Coupon is not valid for these courses!",
      });
    }

    const excludedProducts = existedCoupon.exclude_products || [];
    if (
      excludedProducts.length &&
      params.cycles.some((cycle) => excludedProducts.includes(cycle.courseId))
    ) {
      return res.status(401).json({
        error: true,
        message: "Coupon cannot be applied on these courses!",
      });
    }
    const allowedEmails = existedCoupon.allowed_emails;

    if (
      allowedEmails &&
      allowedEmails.length &&
      allowedEmails.includes(params.user)
    ) {
      return res.status(401).json({
        error: true,
        message: "This coupon is not valid for this email address!",
      });
    }

    return res.status(200).json({
      data: existedCoupon,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const verifyReferral = async (req, res) => {
  try {
    const params = req.body;
    const { err } = Validation.checkCouponBodyValidation(params);
    if (err) {
      return res.status(401).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const existedCode = await Users.findOne({
      where: { referralCode: params.referral },
      attributes: {
        exclude: [
          "updatedAt",
          "createdAt",
          "contract",
          "forgotToken",
          "forgotToken",
          "registerStep",
          "vip",
          "status",
          "status",
          "dateOfBirth",
          "emailVerification",
          "timezone",
          "language",
          "avatar",
          "city",
          "role",
          "address",
          "password",
          "phone",
          "token",
          "country",
          "credit",
          "postalCode",
          "stripeCustomerId",
        ],
      },
    });
    const user = await Users.findOne({ where: { email: params.user } });
    //check if its the first transaction in website
    // const existTransaction = await Transactions.findOne({
    //   where: { userId: user.id },
    // });
    // if (existTransaction) {
    //   return res.status(401).json({
    //     error: true,
    //     message: "This code only works for new users",
    //   });
    // }
    if (!existedCode) {
      return res.status(401).json({
        error: true,
        message: "Code not founded!",
      });
    }
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not founded!",
      });
    }

    if (existedCode.id === user.id) {
      return res.status(401).json({
        error: true,
        message: "You can't use your own referral code!",
      });
    }
    const duplicateDate = await Referral.findOne({
      where: { referrerId: existedCode.id, referredId: user.id },
    });
    if (duplicateDate && duplicateDate.status === "Pending") {
      return res.status(200).json({
        error: false,
        data: existedCode,
      });
    } else if (duplicateDate && duplicateDate.status === "succeed") {
      return res.status(400).json({
        error: true,
        message: "You have used this referral code!",
      });
    } else {
      await Referral.create({
        referrerId: existedCode.id,
        referredId: user.id,
        status: "Pending",
      });
      return res.status(200).json({
        error: false,
        data: existedCode,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

module.exports = { verifyCoupon, verifyReferral };
