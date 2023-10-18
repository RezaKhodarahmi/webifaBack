//Import Model
const Projects = require("../../../../models").Projects;
const TeamProject = require("../../../../models").TeamProject;
const Teams = require("../../../../models").Teams;

const getProjects = async (req, res) => {
  try {
    const projects = await Projects.findAll({ where: { status: 1 } });
    return res.status(200).json({
      error: false,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Projects.findOne({
      where: { id },
      include: [
        {
          model: Teams,
          as: "teams",
        },
      ],
    });
    const teams = await Teams.findAll({ where: { status: 1 } });
    if (!project) {
      return res.status(404).json({
        error: true,
        message: `Project with this id ${id} doesn't exist!`,
      });
    }

    return res.status(200).json({
      error: false,
      data: project,
      allTeams: teams,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const { data, customer, p_manager, team } = req.body;
    const checkExistProject = await Projects.findOne({
      where: { name: data.name },
    });

    if (checkExistProject) {
      return res.status(401).json({
        error: true,
        message: "Project with this title already exist!",
      });
    }

    const project = await Projects.create({
      ...data,
      customer_id: customer.id,
      project_manager: p_manager.id,
      plan_id: parseInt(data.plan_id),
    });
    await TeamProject.create({
      project_id: project.dataValues.id,
      team_id: parseInt(team.id),
    });
    return res.status(201).json({
      error: false,
      message: "Project created successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { data, customer, p_manager, team, startDate, endDate } = req.body;

    // Check if the project exists
    const existingProject = await Projects.findByPk(data.id);

    if (!existingProject) {
      return res.status(404).json({
        error: true,
        message: "Project not found!",
      });
    }

    // Update the project details
    await existingProject.update({
      ...data,
      customer_id: customer.id,
      start_date: startDate,
      end_date: endDate,
      project_manager: p_manager.id,
      plan_id: parseInt(data.plan_id),
    });

    // Update the team for the project. If a team does not exist, create a new association.
    const existingTeamProject = await TeamProject.findOne({
      where: {
        project_id: data.id,
        team_id: parseInt(team.id),
      },
    });

    if (existingTeamProject) {
      await existingTeamProject.update({
        team_id: parseInt(team.id),
      });
    } else {
      await TeamProject.create({
        project_id: data.id,
        team_id: parseInt(team.id),
      });
    }

    return res.status(200).json({
      error: false,
      message: "Project updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Projects.findOne({ where: { id } });
    if (!project) {
      return res.status(401).json({
        error: true,
        message: `Project with this id ${params.id} doesn't exist!`,
      });
    }

    await project.destroy();

    return res.status(201).json({
      error: false,
      message: "Project deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Teams.findAll({ where: { status: 1 } });

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

module.exports = {
  getProjects,
  createProject,
  updateProject,
  getSingleProject,
  deleteProject,
  getTeams,
};
