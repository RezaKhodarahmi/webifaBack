const axios = require("axios");

const getList = async (req, res) => {
  try {
    const { url, key } = req.body;
    const response = await axios.get(
      `${url}/api/3/lists?limit=200`,

      {
        headers: {
          "Api-Token": key,
        },
      }
    );
    if (!response) {
      return res.status(500).json({
        error: true,
        message: "Server Error",
      });
    }
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error",
    });
  }
};

module.exports = {
  getList,
};
