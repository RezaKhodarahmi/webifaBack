const jwt = require("jsonwebtoken");
const UserTokens = require("../models").user_tokens;
 
// Define an asynchronous function called `GenerateTokens` that takes a `user` object as input
const GenerateToken = async (user) => {
  try {
    // Create a payload for the access and refresh tokens
    const payload = { id: user.id, roles: user.role };

    // Generate an access token using the `jwt.sign` method
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    // Generate a refresh token using the `jwt.sign` method
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });

    // Find any existing user tokens for the current user and delete them
    const userToken = await UserTokens.findOne({ where: { userId: user.id } });
    if (userToken) await userToken.destroy();

    // Create a new user token for the current user with the refresh token
    await UserTokens.create({ userId: user.id, token: refreshToken });

    // Return the access and refresh tokens as a resolved promise
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    // Log any errors that occur and return a rejected promise
    console.error(err);
    return Promise.reject(err);
  }
};
module.exports = { GenerateToken };