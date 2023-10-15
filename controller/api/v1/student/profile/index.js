const Courses = require("../../../../../models").Courses;
const Users = require("../../../../../models").Users;
const Enrollments = require("../../../../../models").Enrollments;
const Validation = require("../../../../../utils/dashboard/validationSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcrypt");
const profileInfo = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await Users.findOne({
      where: { email },
      attributes: {
        exclude: [
          "updatedAt",
          "createdAt",
          "contract",
          "forgotToken",
          "registerStep",
          "status",
          "emailVerification",
          "role",
          "password",
          "token",
          "stripeCustomerId",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found!",
      });
    }

    const userEnrollments = await Enrollments.findAll({
      where: { userId: user.id },
    });

    const coursesPromises = userEnrollments.map((enroll) =>
      Courses.findOne({
        where: { id: enroll.courseId },
        include: [
          {
            model: Users,
            as: "teachers",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "contract",
                "forgotToken",
                "registerStep",
                "vip",
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
          },
        ],
      })
    );

    const courses = await Promise.all(coursesPromises);

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
    });

    const vipDate = new Date(user.vip);
    const currentDate = new Date();

    // Remove the time part of the date for accurate comparison
    vipDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const isVipValid = vipDate >= currentDate;
    const remainingDays = Math.ceil(
      (vipDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    return res.status(200).json({
      error: false,
      courses: courses,
      subscription: subscriptions.data[0]?.cancel_at_period_end,
      user: user,
      isVipValid: isVipValid,
      remainingDays: isVipValid ? remainingDays : 0,
    });
  } catch (error) {
    console.error("Error fetching profile info:", error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const { err } = Validation.userLoginValidation(userEmail);
    if (err) {
      return res.status.json({
        error: true,
        message: err.details[0].message,
      });
    }
    const user = await Users.findOne({
      where: { email: userEmail },
      attributes: {
        exclude: [
          "password",
          "forgotToken",
          "token",
          "registerStep",
          "contract",
        ],
      },
    });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found!",
      });
    }
    const userEnrollments = await Enrollments.findAll({
      where: { userId: user.id },
    });
    var courses = [];
    for (const enroll of Object(userEnrollments)) {
      fondCourses = await Courses.findOne({
        where: { id: enroll.courseId },
      });
      courses.push(fondCourses);
    }

    return res.status(200).json({
      error: false,
      courses: courses,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const autoRenewal = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    // Fetch all subscriptions of the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    // Iterate through the list of subscriptions and update the cancel_at_period_end field
    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: !subscription.cancel_at_period_end,
      });
    }

    res.status(200).json({
      error: false,
      message: "Subscriptions updated successfully",
      updated: true,
    });
  } catch (error) {
    console.error("Error updating subscriptions:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateUserData = async (req, res) => {
  try {
    const { email, ...params } = req.body;

    const { error } = Validation.UserProfileUpdateBodyValidation(req.body);
    if (error) {
      return res.status(401).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const user = await Users.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        error: false,
        message: "User not founded!",
      });
    }
    var avatar = user.avatar;

    if (req.file) {
      avatar = process.env.BASE_URL + "/" + req.file.path;
    }
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        user[key] = params[key];
      }
    }
    user.avatar = avatar;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "User updated!",
    });
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

const resetpassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password updated successfully");
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  getCourses,
  autoRenewal,
  profileInfo,
  updateUserData,
  resetpassword,
};
