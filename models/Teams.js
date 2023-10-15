module.exports = (sequelize, DataTypes) => {
  const Teams = sequelize.define("Teams", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_lead: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team_members: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 1,
    },
  });

  Teams.associate = (models) => {
    Teams.belongsToMany(models.Projects, {
      through: "TeamProject",
      foreignKey: "team_id",
      as: "projects",
    });
  };

  return Teams;
};
