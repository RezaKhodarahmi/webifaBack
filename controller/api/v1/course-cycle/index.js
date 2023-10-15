const CourseCycles = require("../../../../models").CourseCycles;
const CoursePerCycle = require("../../../../models").CoursePerCycle;
const Validation = require("../../../../utils/dashboard/validationSchema");

const getCycles = async (req, res) => {
  try {
    const cycles = await CourseCycles.findAll();
    return res.status(200).json({
      error: false,
      data: cycles,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const getCourseCycle = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.GetCycleWithId(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const cycle = await CourseCycles.findAll({ where: { courseId: id } });
    if (!cycle) {
      return res.status(400).json({
        error: true,
        message: "Cycle with this id doesn't exist!",
      });
    }

    return res.status(200).json({
      error: false,
      data: cycle,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};
const createCycle = async (req, res) => {
  try {
    const data = req.body;
    const courseId = parseInt(data.courseId);

    const { err } = Validation.CreateCycleBodyValidation({ data });
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    for (const cycle of Object.values(data)) {
      const existCycle = await CourseCycles.findOne({
        where: { courseId: courseId, secId: cycle.secId },
      });
      if (existCycle) {
      } else {
        const newCycle = await CourseCycles.create({
          secId: cycle.secId,
          courseId: courseId,
          name: cycle.name,
          startDate: cycle.startDate,
          endDate: cycle.endDate,
          vacationStart: cycle.vacationStart,
          vacationEnd: cycle.vacationEnd,
          regularPrice: cycle.regularPrice,
          vipPrice: cycle.vipPrice,
          vipAccess: cycle.vipAccess,
          retake: cycle.retake,
          status: cycle.status,
        });
        await CoursePerCycle.create({
          cycleId: newCycle.id,
          courseId: courseId, // error message: 'CoursePerCycle.courseId cannot be null'
          endDate: newCycle.endDate,
          startDate: newCycle.startDate,
        });
        return res.status(201).json({
          error: false,
          message: "Course Cycles created or updated successfully",
          data: newCycle,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const getCycleWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.GetCycleWithId(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const cycle = await CourseCycles.findOne({ where: { id } });
    if (!cycle) {
      return res.status(400).json({
        error: true,
        message: "Cycle with this id doesn't exist!",
      });
    }
    return res.status(200).json({
      error: false,
      data: cycle,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const updateCycle = async (req, res) => {
  try {
    var { cycles } = req.body;

    for (const cycle of cycles) {
      await CourseCycles.update(cycle, { where: { id: cycle.id } });
    }
    return res.status(201).json({
      error: false,
      message: "The cycle's updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const deleteCycle = async (req, res) => {
  try {
    const id = req.params.id;
    const cycle = await CourseCycles.findOne({ where: { id } });
    const cyclePerCourse = await CoursePerCycle.findOne({
      where: { cycleId: id },
    });
    if (!cycle) {
      return res.status(400).json({
        error: true,
        message: "Cycle with this id not found!",
      });
    }
    if (cyclePerCourse) {
      await cyclePerCourse.destroy();
    }

    await cycle.destroy();

    return res.status(201).json({
      error: false,
      message: "Cycle deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

module.exports = {
  getCycles,
  getCourseCycle,
  createCycle,
  updateCycle,
  getCycleWithId,
  deleteCycle,
};
