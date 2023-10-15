const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken.js");
const TokenValidation = require("../utils/validationSchema.js");
const { user_tokens } = require("../models/");
const { Users } = require("../models/");

// Function to handle Refresh token request
const HandleRefreshToken = async (req, res) => {
  // Check if request body is valid
  const { error } = TokenValidation.RefreshTokenBodyValidation(req.body);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message,
    });
  }

  try {
    const { tokenDetails, userId } =
      await verifyRefreshToken.verifyRefreshToken(req.body.refreshToken);
    const payload = { id: tokenDetails.id, roles: tokenDetails.roles };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRED_TIME,
    });

    const user = await Users.findOne({
      where: { id: userId },
      attributes: {
        exclude: [
          "token",
          "password",
          "updatedAt",
          "createdAt",
          "registerStep",
        ],
      },
    });
    res.status(200).json({
      error: false,
      accessToken,
      data: user,
      role: tokenDetails.roles,
      message: "Access token created successfully",
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// Function to handle Logout request
const HandleLogout = async (req, res) => {
  try {
    // Check if request body is valid
    const { error } = TokenValidation.RefreshTokenBodyValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    // Find the refresh token in user_tokens table
    const userToken = await user_tokens.findOne({
      where: { token: req.body.refreshToken },
    });
    if (!userToken) {
      // Return response if refresh token not found
      return res.status(200).json({
        error: false,
        message: "Logged Out Successfully",
      });
    }
    // Delete the refresh token from user_tokens table
    await user_tokens.destroy({ where: { token: req.body.refreshToken } });
    // Return success response
    return res.status(200).json({
      error: false,
      message: "Logged Out Successfully",
    });
  } catch (err) {
    // Handle any internal server error
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Exporting the functions to be used in other modules
module.exports = { HandleRefreshToken, HandleLogout };
