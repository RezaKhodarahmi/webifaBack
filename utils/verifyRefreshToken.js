// Import the user_tokens model and the jsonwebtoken library
const { user_tokens } = require("../models");
const jwt = require("jsonwebtoken");

// Define a function to verify the validity of a refresh token
const verifyRefreshToken = (refreshToken) => {
  // Retrieve the private key from the environment variable
  const privateKey = process.env.REFRESH_TOKEN_SECRET;

  // Create a promise to find the user token in the database
  return new Promise((resolve, reject) => {
    user_tokens
      .findOne({ where: { token: refreshToken } }) // Search for the user token based on the refresh token
      .then((doc) => {
        // If the user token is found
        if (!doc) {
          // Check if the token is invalid
          return reject({ error: true, message: "Invalid refresh token" }); // Reject the promise with an error message
        }

        // Verify the authenticity of the token using the private key
        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
          if (err) {
            // If the token is invalid
            return reject({ error: true, message: "Invalid refresh token" }); // Reject the promise with an error message
          }

          // If the token is valid, resolve the promise with an object containing the token details, a success message, and the user ID
          resolve({
            tokenDetails,
            error: false,
            message: "Valid refresh token",
            userId: doc.userId,
          });
        });
      })
      .catch((err) => {
        console.error(err); // Log any errors to the console
      });
  });
};

// Export the verifyRefreshToken function
module.exports = { verifyRefreshToken };
