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

    Teams.belongsTo(models.Users, {
      foreignKey: "team_lead",
      as: "lead",
    });

    Teams.belongsToMany(models.Users, {
      through: "TeamMembers",
      foreignKey: "team_id",
      otherKey: "user_id",
      as: "members",
    });
  };

  return Teams;
};
