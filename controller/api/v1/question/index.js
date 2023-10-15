//Import Model
const Questions = require("../../../../models").Questions;
const Answers = require("../../../../models").Answers;

const getQuestions = async (req, res) => {
  try {
    const questions = await Questions.findAll();
    return res.status(200).json({
      error: false,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const creteNewQuestion = async (req, res) => {
  try {
    const params = req.body;
    const existingArray = [];
    for (const question of Object.values(params)) {
      const existQuestion = await Questions.findOne({
        where: { testId: question.testId, questionText: question.questionText },
      });
      if (existQuestion) {
        existingArray.push({ ...existQuestion });
      } else {
        const newQuestion = await Questions.create(question);
        return res.status(201).json({
          error: false,
          data: newQuestion,
          existed: existingArray,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const params = req.body;
    // Update each question in the array
    const promises = params.map((question) => {
      return Questions.update(question, { where: { id: question.id } });
    });
    await Promise.all(promises);
    return res.status(201).json({
      error: false,
      message: "The question updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const getQuestionWithId = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const params = req.body;
    const question = await Questions.findOne({
      where: { testId: params.id, secId: params.secId },
    });

    if (!question) {
      return res.status(400).json({
        error: true,
        message: "Question with this ID doesn't exist!",
      });
    }

    // Delete associated answers
    await Answers.destroy({
      where: { questionId: question.id },
    });

    // Delete the question
    await question.destroy();

    return res.status(201).json({
      error: false,
      message: "The question and its answers deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

module.exports = {
  getQuestions,
  creteNewQuestion,
  updateQuestion,
  getQuestionWithId,
  deleteQuestion,
};
