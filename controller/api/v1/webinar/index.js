const Webinars = require("../../../../models").Webinars;
const Validation = require("../../../../utils/dashboard/validationSchema");

const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinars.findAll();
    return res.status(200).json({
      error: false,
      data: webinars,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const createWebinar = async (req, res) => {
  try {
    const params = req.body;
    const { err } = Validation.createWebinarValidation(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const checkIfExistWebinar = await Webinars.findOne({
      where: { slug: params.slug },
    });
    if (checkIfExistWebinar) {
      return res.status(400).json({
        error: true,
        message: "Slug is duplicate!",
      });
    }
    var image = null;
    if (req.file) {
      image = process.env.BASE_URL + "/" + req.file.path;
    }
    const webinar = await Webinars.create({
      ...params,
      image,
    });

    return res.status(201).json({
      error: false,
      message: "Webinar created successfully!",
      data: webinar,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
const getWebinarWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.getWebinarWithIdValidation(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const webinar = await Webinars.findByPk(id);

    if (!webinar) {
      return res.status(404).json({
        error: true,
        message: "Webinar not found!",
      });
    }

    return res.status(200).json({
      error: false,
      data: webinar,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const updateWebinar = async (req, res) => {
  try {
    const params = req.body;

    const { err } = Validation.updateWebinarValidation(params.id, params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const webinar = await Webinars.findByPk(params.id);

    if (!webinar) {
      return res.status(404).json({
        error: true,
        message: "Webinar not found!",
      });
    }

    var image = webinar.image; // Preserve the existing image unless a new one is provided
    if (req.file) {
      image = process.env.BASE_URL + "/" + req.file.path;
    }
    await webinar.update({
      ...params,
      image,
    });

    return res.status(200).json({
      error: false,
      message: "Webinar updated successfully!",
      data: webinar,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

const deleteWebinar = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.deleteWebinarValidation(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const webinar = await Webinars.findByPk(id);

    if (!webinar) {
      return res.status(404).json({
        error: true,
        message: "Webinar not found!",
      });
    }

    await webinar.destroy();

    return res.status(200).json({
      error: false,
      message: "Webinar deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};
module.exports = {
  getWebinars,
  createWebinar,
  getWebinarWithId,
  updateWebinar,
  deleteWebinar,
};
