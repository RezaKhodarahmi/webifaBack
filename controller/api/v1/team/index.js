//Import Model
const Teams = require("../../../../models").Teams;

const getTeams = async (req, res) => {
  try {
    const teams = await Teams.findAll();

    return res.status(200).json({
      error: false,
      data: teams,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getSingleTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Teams.findOne({ where: { id } });
    if (!team) {
      return res.status(404).json({
        error: true,
        message: `Team with this id ${id} doesn't exist!`,
      });
    }

    return res.status(200).json({
      error: false,
      data: team,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const createTeam = async (req, res) => {
  try {
    const params = req.body;
    const checkExistTeam = await Teams.findOne({
      where: { name: params.name },
    });

    if (checkExistTeam) {
      return res.status(401).json({
        error: true,
        message: "Team with this title already exist!",
      });
    }

    await Teams.create({ ...params });

    return res.status(201).json({
      error: false,
      message: "Team created successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const params = req.body;
    const team = await Teams.findOne({ where: { id: params.id } });

    if (!team) {
      return res.status(401).json({
        error: true,
        message: `Team with this id ${params.id} doesn't exist!`,
      });
    }

    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        team[key] = params[key];
      }
    }
    await team.save();

    return res.status(200).json({
      error: false,
      message: "The Team Updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Teams.findOne({ where: { id } });
    if (!team) {
      return res.status(401).json({
        error: true,
        message: `Team with this id ${params.id} doesn't exist!`,
      });
    }

    await team.destroy();

    return res.status(201).json({
      error: false,
      message: "Team deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

module.exports = {
  getTeams,
  createTeam,
  updateTeam,
  getSingleTeam,
  deleteTeam,
};
