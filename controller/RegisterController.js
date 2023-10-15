const bcrypt = require("bcrypt");
const Users = require("../models").Users;

const handelRegister = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({
        error: true,
        message: `The user with ${email} already exist`,
      });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    const newuser = await Users.create({
      email,
      phone,
      password: hashPassword,
      role: 2000,
    });
    return res.status(200).json({
      error: false,
      message: "The user created successfully.",
      data: newuser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

module.exports = { handelRegister };
