module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define("user_tokens", {
    // Define the columns of the user_tokens table
    userId: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      expires: process.env.REFRESH_TOKEN_EXPIRES_TIME,
    },
  });

  return UserToken;
};
