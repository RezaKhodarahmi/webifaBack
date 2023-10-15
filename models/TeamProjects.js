module.exports = (sequelize, DataTypes) => {
  const TeamProject = sequelize.define("TeamProject", {
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return TeamProject;
};
