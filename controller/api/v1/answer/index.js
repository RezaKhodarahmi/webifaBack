//Import Model
const Answers = require("../../../../models").Answers;

const getAnswers = async (req, res) => {
  try {
    const id = req.params.id;
    const answers = await Answers.findAll({ where: { questionId: id } });
    return res.status(200).json({
      error: false,
      data: answers,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const createNewAnswer = async (req, res) => {
  try {
    const params = req.body;

    // Assuming you have a "questionId" field in your answer objects
    const questionIds = params.map((answer) => answer.questionId);

    // Remove duplicate questionIds
    const uniqueQuestionIds = [...new Set(questionIds)];

    // Delete old answers for each unique questionId
    await Promise.all(
      uniqueQuestionIds.map((questionId) => {
        return Answers.destroy({ where: { questionId } });
      })
    );

    // Create new answers
    const promises = params.map((answer) => {
      return Answers.create(answer);
    });
    await Promise.all(promises);

    // Send a response if needed
    return res.status(200).json({ message: "Answers updated successfully" });
  } catch (error) {
    // Send an error response if needed
    return res
      .status(500)
      .json({ message: "An error occurred while updating answers" });
  }
};
const updateAnswer = async (req, res) => {
  try {
    const params = req.body.filter((item) => item.length > 0);

    // Ensure every answer array has a valid questionId
    if (params.some((answerArray) => !answerArray[0].questionId)) {
      return res
        .status(400)
        .json({ message: "Some answers are missing a questionId" });
    }

    // Delete old answers for each unique questionId
    const uniqueQuestionIds = [
      ...new Set(params.map((answerArray) => answerArray[0].questionId)),
    ];
    await Promise.all(
      uniqueQuestionIds.map((questionId) => {
        return Answers.destroy({ where: { questionId } });
      })
    );

    // Create new answers
    const promises = params.flat().map((answer) => {
      return Answers.create(answer);
    });
    await Promise.all(promises);

    return res.status(200).json({ message: "Answers updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "An error occurred while updating answers",
        error: error.message,
      });
  }
};

const getAnswerWithId = async (req, res) => {};
const deleteAnswer = async (req, res) => {};

module.exports = {
  getAnswers,
  createNewAnswer,
  updateAnswer,
  getAnswerWithId,
  deleteAnswer,
};
