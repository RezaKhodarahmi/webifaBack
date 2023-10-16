const Users = require("../../../../models").Users;
const Validation = require("../../../../utils/dashboard/validationSchema");
const crypto = require("crypto");

//Generate Referral code
const generateCode = (length = 6) => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excluding characters like I, O, Q, 0, 1
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
};
const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["token", "password", "forgotToken", "contract"] },
    });
    return res.json({
      error: false,
      data: users,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Server error!",
    });
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await Users.findAll({
      where: { role: 3000, status: 1 },
      attributes: { exclude: ["token", "password", "forgotToken", "contract"] },
    });
    return res.status(200).json({
      error: false,
      data: authors,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const getTeachers = async (req, res) => {
  try {
    const teachers = await Users.findAll({
      where: { role: 1000, status: 1 },
      attributes: { exclude: ["token", "password", "forgotToken", "contract"] },
    });
    return res.status(200).json({
      error: false,
      data: teachers,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const data = req.body;
    const { error } = Validation.NewUserBodyValidation(data);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const existUser = await Users.findOne({ where: { email: data.email } });
    if (existUser) {
      return res.status(400).json({
        error: true,
        message: "This email is already registered",
      });
    }

    let imageData = null;
    if (req.file) {
      imageData = process.env.BASE_URL + "/" + req.file.path;
    }
    const referralCode = generateCode();
    const user = await Users.create({
      ...data,
      referralCode,
      avatar: imageData,
      attributes: { exclude: ["token", "password", "forgotToken", "contract"] },
    });
    return res.status(201).json({
      error: false,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const getUserWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({
      where: { id },
      attributes: {
        exclude: [
          "token",
          "password",
          "forgotToken",
          "contract",
          "registerStep",
          "language",
          "timezone",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }
    return res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const { error } = Validation.UserEditBodyValidation(data);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    if (req.file) {
      data.avatar = process.env.BASE_URL + "/" + req.file.path;
    }

    var user = await Users.findOne({ where: { id: data.id } });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found!",
      });
    }
    const EmailExists = await Users.findOne({ where: { email: data.email } });
    if (EmailExists && EmailExists.id !== user.id) {
      return res.status(400).json({
        error: true,
        message: "User with this email already exists!",
      });
    }
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        user[key] = data[key];
      }
    }
    await user.save();
    return res.status(201).json({
      error: false,
      message: "The user updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found",
      });
    }
    await user.destroy();
    return res.status(201).json({
      error: false,
      message: "User deleted successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
module.exports = {
  getUsers,
  getUserWithId,
  updateUser,
  deleteUser,
  createUser,
  getAuthors,
  getTeachers,
};
