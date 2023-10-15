module.exports = (sequelize, DataTypes) => {
  const Projects = sequelize.define("Projects", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_manager: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    budget_spent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    prepayment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 1,
    },
  });
  Projects.associate = (models) => {
    Projects.hasMany(models.Tasks, {
      foreignKey: "project_id",
      as: "tasks",
    });

    Projects.belongsToMany(models.Teams, {
      through: "TeamProject", // The name of the join table
      foreignKey: "project_id",
      as: "teams", // This is an alias for the association
    });
  };
  return Projects;
};
