const Coupon = require("../../../../models").Coupon;

//Inputs validation
const Validation = require("../../../../utils/dashboard/validationSchema");

//Get all coupons
const getCoupons = async (req, res) => {
  try {
    //Find all coupons
    const coupons = await Coupon.findAll();

    //Send all coupons as result
    return res.status(200).json({
      error: false,
      data: coupons,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Get coupon with code (code)
const getCouponWithID = async (req, res) => {
  try {
    //Get code
    const { id } = req.params;

    //Find code
    const coupon = await Coupon.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    //Check if not exist
    if (!coupon) {
      return res.status(401).json({
        error: true,
        message: "The coupon not founded!",
      });
    }

    //Send results
    return res.status(200).json({
      error: false,
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
//Create new coupon
const createCoupon = async (req, res) => {
  try {
    //Get the params
    const params = req.body;

    if (
      (params.discount_percentage === "" ||
        params.discount_percentage === null) &&
      (params.discount_amount === "" || params.discount_amount === null)
    ) {
      return res.status(401).json({
        error: true,
        message: "Both of Discount Amount and Discount Percentage are empty!",
      });
    } //CHeck if one of discount_percentage or discount_amount are empty
    if (
      params.discount_percentage === "" ||
      params.discount_percentage === null
    ) {
      delete params["discount_percentage"];
    }
    if (params.discount_amount === "" || params.discount_amount === null) {
      delete params["discount_amount"];
    }

    //Validate inputs
    const { error } = Validation.handleCouponCreate(params);

    if (error) {
      return res.status(401).json({
        error: true,
        message: error.details[0].message,
      });
    }

    //Check if coupon existed
    const existedCoupon = await Coupon.findOne({
      where: { code: params.code },
    });
    if (existedCoupon) {
      return res.status(401).json({
        error: true,
        message: "The coupon with this code already existed!",
      });
    }

    //Create new coupon
    const coupon = await Coupon.create(params);

    //Return result
    return res.status(201).json({
      error: false,
      message: "The coupon crated successfully!",
      data: coupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Update coupon
const updateCoupon = async (req, res) => {
  try {
    //Get the params
    const params = req.body;

    //Return error if both of them are empty
    if (
      (params.discount_percentage === "" ||
        params.discount_percentage === null) &&
      (params.discount_amount === "" || params.discount_amount === null)
    ) {
      return res.status(401).json({
        error: true,
        message: "Both of Discount Amount and Discount Percentage are empty!",
      });
    }

    //Check if one of them are have value delete another because of validation
    if (
      params.discount_percentage === "" ||
      params.discount_percentage === null
    ) {
      delete params["discount_percentage"];
    }
    if (params.discount_amount === "" || params.discount_amount === null) {
      delete params["discount_amount"];
    }

    //Set new data and make one of them are null
    var discount_percentage = null;
    var discount_amount = null;

    if (params.discount_percentage) {
      discount_percentage = params.discount_percentage;
      discount_amount = null;
    }
    if (params.discount_amount) {
      discount_amount = params.discount_amount;
      discount_percentage = null;
    }

    //Validate inputs
    const { error } = Validation.handleCouponUpdate(params);

    if (error) {
      return res.status(401).json({
        error: true,
        message: error.details[0].message,
      });
    }

    //Find the coupon in database
    const coupon = await Coupon.findOne({ where: { id: params.id } });

    //Return if not existed
    if (!coupon) {
      return res.status(401).json({
        error: true,
        message: "Coupon is not existed!",
      });
    }

    for (const item in Object(params)) {
      coupon[item] = params[item];
      coupon["discount_amount"] = discount_amount;
      coupon["discount_percentage"] = discount_percentage;

      await coupon.save();
    }
    return res.status(200).json({
      error: false,
      message: "The coupon updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Handel delete coupon
const deleteCoupon = async (req, res) => {
  try {
    //Get the coupon code
    const { id } = req.params;
    //Find the coupon
    const coupon = await Coupon.findOne({ where: { id } });
    if (!coupon) {
      return res.status(401).json({
        error: true,
        message: "The coupon is not existed!",
      });
    }

    //Destroy coupon
    await coupon.destroy();

    //Send results
    return res.status(200).json({
      error: false,
      message: "The coupon deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
module.exports = {
  getCoupons,
  getCouponWithID,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
