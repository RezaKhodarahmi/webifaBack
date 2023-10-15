const db = require("../../../../../models");
const getTests = async (req, res) => {
  try {
    const { slug } = req.params;
    const tests = await db.Tests.findOne({
      where: { slug },
      include: [
        {
          model: db.Questions,
          as: "questions",
          include: [
            {
              model: db.Answers,
              as: "answers",
            },
          ],
        },
      ],
    });
    if (!tests) {
      return res.status(401).json({
        error: true,
        message: "The test doesn't exists",
      });
    }
    return res.status(200).json({
      data: tests,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

module.exports = { getTests };
