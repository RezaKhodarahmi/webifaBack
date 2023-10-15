module.exports = (sequelize, DataTypes) => {
  const Plans = sequelize.define("Plans", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regular_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    vip_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 1,
    },
  });

  return Plans;
};
