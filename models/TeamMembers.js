module.exports = (sequelize, DataTypes) => {
  const TeamMembers = sequelize.define("TeamMembers", {
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  });

  return TeamMembers;
};
