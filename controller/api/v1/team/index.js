//Import Model
const Teams = require("../../../../models").Teams;
const Users = require("../../../../models").Users;
const TeamMembers = require("../../../../models").TeamMembers;
const getTeams = async (req, res) => {
  try {
    const teams = await Teams.findAll({
      include: [
        {
          model: Users,
          as: "lead",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Users,
          as: "members",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    return res.status(200).json({
      error: false,
      data: teams,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getSingleTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const allUsers = await Users.findAll({
      attributes: ["id", "firstName", "lastName"],
    });
    const team = await Teams.findOne({
      where: { id },
      include: [
        {
          model: Users,
          as: "lead",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Users,
          as: "members",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!team) {
      return res.status(404).json({
        error: true,
        message: `Team with this id ${id} doesn't exist!`,
      });
    }

    return res.status(200).json({
      error: false,
      data: team,
      users: allUsers,
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
    const { name, leader, status, members } = req.body;

    // Check for existing team with same name
    const checkExistTeam = await Teams.findOne({
      where: { name: name },
    });

    if (checkExistTeam) {
      return res.status(401).json({
        error: true,
        message: "Team with this title already exists!",
      });
    }

    // Create a new team
    const newTeam = await Teams.create({
      name: name,
      team_lead: leader,
      status: status,
    });

    // Associate members with the new team
    const memberIds = members.map((member) => member.id);
    await newTeam.addMembers(memberIds);

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
    const { id, name, status, leader, members } = req.body;

    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Team ID is required!",
      });
    }

    const updatedTeam = await Teams.update(
      {
        name,
        status,
        team_lead: parseInt(leader),
      },
      {
        where: { id },
      }
    );

    if (updatedTeam[0] !== 1) {
      return res.status(400).json({
        error: true,
        message: "Failed to update team!",
      });
    }

    await TeamMembers.destroy({ where: { team_id: id } });

    const teamMembersData = members.map((member) => ({
      team_id: id,
      user_id: member.id,
    }));
    await TeamMembers.bulkCreate(teamMembersData);

    res.json({
      success: true,
      message: "Team updated successfully!",
    });
  } catch (error) {
    console.error(error);
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
