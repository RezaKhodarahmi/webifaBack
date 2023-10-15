module.exports = (sequelize, DataTypes) => {
  const Tasks = sequelize.define("Tasks", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_done: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  });

  Tasks.associate = (models) => {
    Tasks.belongsTo(models.Projects, {
      foreignKey: "project_id",
      as: "project",
    });
  };

  return Tasks;
};
