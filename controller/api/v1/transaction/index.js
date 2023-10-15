const { json } = require("sequelize");

const Transactions = require("../../../../models").Transactions;
const Courses = require("../../../../models").Courses;
const Users = require("../../../../models").Users;
const CourseCycles = require("../../../../models").CourseCycles;

//Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.findAll({
      include: [
        {
          model: Courses,
          as: "courses",
        },
        {
          model: CourseCycles,
          as: "cycles",
        },
        {
          model: Users,
          as: "user",
        },
      ],
      attributes: {
        exclude: [
          "courseId",
          "cycleId",
          "Stripe_Charge_ID",
          "Currency",
          "coupons",
          "createdAt",
          "updatedAt",
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    // Log the transactions to check the data
    return res.status(200).json({
      error: false,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Create transactions
const creteNewTransaction = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Update transactions
const updateTransaction = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Get transaction with ID
const getTransactionWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transactions.findOne({
      where: { transaction_ID: id },
      include: [
        {
          model: Courses,
          as: "courses",
        },
        {
          model: CourseCycles,
          as: "cycles",
        },
        {
          model: Users,
          as: "user",
        },
      ],
      attributes: {
        exclude: ["courseId", "cycleId", "createdAt", "updatedAt"],
      },
    });

    if (!transaction) {
      return res.status(401).json({
        error: true,
        message: "Transaction with this ID doesn't exist!",
      });
    }

    res.status(200).json({
      error: false,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Delete transactions
const deleteTransaction = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
module.exports = {
  getTransactions,
  creteNewTransaction,
  updateTransaction,
  getTransactionWithId,
  deleteTransaction,
};
