module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define("OTP", {
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return OTP;
};
