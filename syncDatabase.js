const db = require("./models"); // replace with the path to your sequelize setup file

db.sequelize
  .sync({ force: false }) // Setting force to 'true' will drop the table if it already exists and create a new one.
  .then(() => {
    process.exit();
  })
  .catch((error) => {
    process.exit(1);
  });
