const Users = require("../../../../../models").Users;
const NewDate = new Date().getFullYear();
const bcrypt = require("bcrypt");
const Validation = require("../../../../../utils/dashboard/validationSchema");
const { transporter } = require("../../../../../config/mailSender");
const { apps } = require("../../../../../config/mailSender");

const {
  getRegistrationEmailTemplate,
} = require("../../../../../views/email-template/verification");
const {
  thanksRegistrationEmailTemplate,
} = require("../../../../../views/email-template/thanksRegistration");
const crypto = require("crypto");

//Generate Referral code
const generateCode = (length = 6) => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excluding characters like I, O, Q, 0, 1
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
};
const getUserWithEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const { err } = Validation.userWithEmailBodyValidation(email);
    if (err) {
      res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const user = await Users.findOne({
      where: { email },
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
      return res.status(401).json({
        error: true,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "This email address already exists! Please log in.",
      error: true,
    });
  }
};
const handelRegister = async (req, res) => {
  try {
    // Request body parameters
    const { email, firstName, lastName, phone, ...params } = req.body;
    const { err } = Validation.userRegisterBodyValidation(params);
    if (err) {
      res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    // Checking if user exists
    const user = await Users.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
    if (user) {
      // User with email exists but not verified
      if (user.emailVerification == 0) {
        let token = user.token;

        if (!token) {
          token =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
          user.token = token;
          await user.save();
        }
        user.registerStep = 1;
        await user.save();
        // Composing email options
        const mailOptions = {
          from: '"Fanavaran" <no-reply@fanavaran.ca>',
          to: email,
          subject: "Continue your wizard registration",
          html: getRegistrationEmailTemplate(email, token, NewDate),
        };

        // Sending the registration email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
          error: false,
          message: `Verification email sent, to complete registration check your email `,
          data: user,
        });
      } else {
        // User with email already exists and verified
        res.status(400).json({
          message: "This email address already exists! Please log in.",
          error: true,
        });
      }
    } else {
      // Creating a new user
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const referralCode = generateCode();
      const newUser = await Users.create({
        email,
        firstName,
        lastName,
        phone,
        token,
        registerStep: 1,
        referralCode,
      });

      // Composing email options
      const mailOptions = {
        from: '"Fanavaran" <no-reply@fanavaran.ca>',
        to: email,
        subject: "Continue your wizard registration",
        html: getRegistrationEmailTemplate(email, token, NewDate),
      };

      // Sending the registration email
      await transporter.sendMail(mailOptions);
      return res.status(201).json({
        error: false,
        message:
          "Verification email sent, to complete registration check your email.",
        data: newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const HandleTokenValidation = async (req, res) => {
  try {
    const { token } = req.body;

    // Validate request body
    const { error } = Validation.VerifyRegisteredUser(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }
    const user = await Users.findOne({
      where: { token: token },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.emailVerification === 1) {
      return res.status(200).json({
        error: false,
        message: "Your account is already active!",
        data: user,
      });
    } else {
      user.emailVerification = 1;
      if (parseInt(user.registerStep) === 1) {
        user.registerStep = 2;
      }
      await user.save();
      return res
        .status(200)
        .json({ message: "Token validated successfully", data: user });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const HandlePersonalInfo = async (req, res) => {
  try {
    const { registerStep, email, token } = req.body;

    const user = await Users.findOne({ where: { email, token } });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found!",
      });
    }

    //For sending response if user saved
    var changed = false;
    switch (parseInt(registerStep)) {
      case 2:
        var { password } = req.body;
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);
        user.password = hashPassword;
        user.registerStep = 3;
        await user.save();
        changed = true;
        break;
      case 3:
        var { postalCode, address, city, country } = req.body;

        user.postalCode = postalCode;
        user.address = address;
        user.city = city;
        user.country = country;
        user.registerStep = 4;
        await user.save();
        break;
      case 4:
        var { contract } = req.body;
        user.contract = contract;
        user.registerStep = 5;
        user.token = null;
        await user.save();
        changed = true;
        // Composing email options
        const mailOptions = {
          from: '"Fanavaran" <no-reply@fanavaran.ca>',
          to: email,
          subject:
            "Registration Successful! Welcome to the Fanavaran Community. ",
          html: thanksRegistrationEmailTemplate(email, NewDate),
        };

        // Sending the registration email
        await transporter.sendMail(mailOptions);
        break;
      default:
        var { data } = req.body;
        changed = false;
        break;
    }
    if (changed) {
      return res.status(201).json({
        error: true,
        message: "User updated successfully",
      });
    }
    return res.status(400).json({
      error: true,
      message: "User not updated!!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

//Handel user edit profile
const HandleUserUpdate = async (req, res) => {
  try {
    const params = req.body;

    //Validate inputs
    const { err } = Validation.handelUserUpdate(params);
    if (err) {
      return res.status(401).json({
        error: true,
        message: err.details[0].message,
      });
    }

    //Find user
    const user = await Users.findOne({
      where: {
        email: params.email,
      },
    });

    //Return if user doesn't exist
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not found!",
      });
    }
    //Set user old avatar
    params.avatar = user.avatar;

    //Set new user avatar
    if (req.file) {
      params.avatar = process.env.BASE_URL + "/" + req.file.path;
    }
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        user[key] = params[key];
      }
    }
    await user.save();

    //Send success response
    return res.status(201).json({
      error: false,
      message: "The user updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error",
    });
  }
};

const getUserVipInfo = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send("User not found"); // or another response if the user is not found
    }

    // Convert the user.vip string to a Date object
    const vipDate = new Date(user.vip);

    // Create a Date object for the current date/time
    const currentDate = new Date();

    // Remove the time part of the date for accurate comparison
    vipDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    // Check if the vipDate is greater than the current date
    if (vipDate > currentDate || vipDate.getTime() === currentDate.getTime()) {
      return res.send({ isVipValid: true }); // or however you want to return the result
    } else {
      return res.send({ isVipValid: false });
    }
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};
module.exports = {
  handelRegister,
  HandleTokenValidation,
  HandlePersonalInfo,
  HandleUserUpdate,
  getUserWithEmail,
  getUserVipInfo,
};
