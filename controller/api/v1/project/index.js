//Import Model
const Projects = require("../../../../models").Projects;

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

    const project = await Projects.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({
        error: true,
        message: `Project with this id ${id} doesn't exist!`,
      });
    }

    return res.status(200).json({
      error: false,
      data: project,
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
    const { data, customer, p_manager } = req.body;

    const checkExistProject = await Projects.findOne({
      where: { name: data.name },
    });

    if (checkExistProject) {
      return res.status(401).json({
        error: true,
        message: "Project with this title already exist!",
      });
    }

    await Projects.create({
      ...data,
      customer_id: customer.id,
      project_manager: p_manager.id,
      plan_id: parseInt(data.plan_id),
    });

    return res.status(201).json({
      error: false,
      message: "Project created successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const params = req.body;
    const project = await Projects.findOne({ where: { id: params.id } });

    if (!project) {
      return res.status(401).json({
        error: true,
        message: `Project with this id ${params.id} doesn't exist!`,
      });
    }

    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        project[key] = params[key];
      }
    }
    await project.save();

    return res.status(200).json({
      error: false,
      message: "The Project Updated successfully!",
    });
  } catch (error) {
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

module.exports = {
  getProjects,
  createProject,
  updateProject,
  getSingleProject,
  deleteProject,
};
