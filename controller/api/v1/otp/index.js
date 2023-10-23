const Users = require("../../../../models").Users;
const OTP = require("../../../../models").OTP;
const TokenGenerator = require("../../../../utils/generateToken.js");
const { checkRole } = require("../../../../middlewares/roleCheck");
const axios = require("axios");

const sendSMS = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await Users.findOne({ where: { phone: mobile } });
    if (!user) {
      return res.status(403).json({
        error: true,
        message: "Not registered!",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.destroy({
      where: {
        mobile,
      },
    });
    await OTP.create({ mobile, code: otp });
    const response = await axios.post(
      "https://api.limosms.com/api/sendsms",
      {
        Message: `کد تایید: ${otp}`,
        SenderNumber: "10001000004400",
        MobileNumber: [mobile],
        SendToBlocksNumber: true,
      },
      {
        headers: {
          ApiKey: "dbc13081-d438-4700-a201-ce86a1591c83",
        },
      }
    );
    return res.status(200).json({
      error: false,
      message: "Code sent.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const verify = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const user = await Users.findOne({ where: { phone: mobile } });

    if (!user) {
      return res.status(403).json({
        error: true,
        message: "Not registered!",
      });
    }
    const storedData = await OTP.findOne({ where: { mobile, code: otp } });

    if (!storedData) {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }

    const otpGeneratedTime = new Date(storedData.createdAt);
    const currentTime = new Date();
    const timeDifference = (currentTime - otpGeneratedTime) / (1000 * 60); // Difference in minutes
    if (timeDifference < 50) {
      checkRole(user.role)(req, res, async () => {
        const { accessToken, refreshToken } =
          await TokenGenerator.GenerateToken(user);
        res.status(200).json({
          error: false,
          accessToken,
          refreshToken,
          data: user,
          message: "Logged in successfully",
        });
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "OTP has expired",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

module.exports = { sendSMS, verify };
