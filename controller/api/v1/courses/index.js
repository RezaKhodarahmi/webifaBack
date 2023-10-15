const Courses = require("../../../../models").Courses;
const CourseCycles = require("../../../../models").CourseCycles;
const Users = require("../../../../models").Users;
const Categories = require("../../../../models").Categories;
const CoursePerCategory = require("../../../../models").CoursePerCategory;
const TeacherPerCourse = require("../../../../models").TeacherPerCourse;
const Validation = require("../../../../utils/dashboard/validationSchema");

const getCourses = async (req, res) => {
  try {
    const courses = await Courses.findAll({
      include: [
        {
          model: CourseCycles,
          as: "cycles",
        },
        {
          model: Users,
          as: "teachers",
        },
        {
          model: Categories,
          as: "categories",
        },
      ],
    });
    return res.status(200).json({
      error: false,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const data = req.body;
    const { err } = Validation.CreateCourseBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const course = await Courses.findOne({ where: { slug: data.slug } });
    if (course) {
      return res.status(400).json({
        error: true,
        message: "Duplicate Slug",
      });
    }
    var image = "";
    var certificate = "";
    var introPoster = "";

    if (req.files) {
      if (req.files["image"] && req.files["image"].length > 0) {
        image =
          process.env.BASE_URL +
          "/" +
          req.files["image"][0].path.replace(/\\/g, "/");
      }
      if (req.files["certificate"] && req.files["certificate"].length > 0) {
        certificate =
          process.env.BASE_URL +
          "/" +
          req.files["certificate"][0].path.replace(/\\/g, "/");
      }
      if (req.files["introPoster"] && req.files["introPoster"].length > 0) {
        introPoster =
          process.env.BASE_URL +
          "/" +
          req.files["introPoster"][0].path.replace(/\\/g, "/");
      }
    }
    const newCourse = await Courses.create({
      ...data,
      image,
      certificate,
      introPoster,
    });
    return res.status(201).json({
      error: false,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};
const getCourseWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.GetCourseWithId(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const course = await Courses.findOne({
      where: { id },
      include: [
        {
          model: CourseCycles,
          as: "cycles",
        },
        {
          model: Users,
          as: "teachers",
        },
        {
          model: Categories,
          as: "categories",
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!course) {
      return res.status(400).json({
        error: true,
        message: "Course with this id doesn't exist!",
      });
    }
    return res.status(200).json({
      error: false,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { cats, teacher, ...data } = req.body;
    console.log(req.body);
    const { err } = Validation.UpdateCourseBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const course = await Courses.findOne({ where: { id: data.id } });

    if (!course) {
      return res.status(400).json({
        error: true,
        message: "Course with this id doesn't exist!",
      });
    }
    var image = "";
    var certificate = "";
    var introPoster = "";

    if (course.image) {
      image = course.image;
    }
    if (course.certificate) {
      certificate = course.certificate;
    }
    if (course.introPoster) {
      introPoster = course.introPoster;
    }

    if (req.files) {
      if (req.files["image"] && req.files["image"].length > 0) {
        image =
          process.env.BASE_URL +
          "/" +
          req.files["image"][0].path.replace(/\\/g, "/");
      }
      if (req.files["certificate"] && req.files["certificate"].length > 0) {
        certificate =
          process.env.BASE_URL +
          "/" +
          req.files["certificate"][0].path.replace(/\\/g, "/");
      }
      if (req.files["introPoster"] && req.files["introPoster"].length > 0) {
        introPoster =
          process.env.BASE_URL +
          "/" +
          req.files["introPoster"][0].path.replace(/\\/g, "/");
      }
    }
    const slugExists = await Courses.findOne({ where: { slug: data.slug } });
    if (slugExists && slugExists.id !== course.id) {
      return res.status(400).json({
        error: true,
        message: "Course with this slug already exists!",
      });
    }

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        course[key] = data[key];
      }
    }
    course.certificate = certificate;
    course.image = image;
    course.introPoster = introPoster;
    await course.save();

    //Destroy all course teacher
    await TeacherPerCourse.destroy({
      where: { courseId: course.id },
    });

    //Set new teacher
    await TeacherPerCourse.create({
      courseId: course.id,
      teacherId: teacher,
      cycleId: 1,
    });
    const newCategory = JSON.parse(cats);
    if (newCategory && newCategory.length) {
      // Delete the existing categories for the course
      await CoursePerCategory.destroy({ where: { courseId: course.id } });
      // Create new categories for the course
      for (const category of newCategory) {
        await CoursePerCategory.create({
          courseId: course.id,
          categoryId: parseInt(category.value),
        });
      }
    }
    return res.status(201).json({
      error: false,
      message: "The course updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.UpdateCourseBodyValidation(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const course = await Courses.findOne({ where: { id } });
    if (!course) {
      return res.status(400).json({
        error: true,
        message: "Course with this id not found!",
      });
    }

    await course.destroy();

    return res.status(201).json({
      error: false,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const deleteCourseCategory = async (req, res) => {
  try {
    const { catId, courseId } = req.body;
    const { err } = Validation.validateCourseCategoryDelete(req.body);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const courseCategory = await CoursePerCategory.findOne({
      where: { categoryId: catId, courseId: courseId },
    });
    if (!courseCategory) {
      return res.status(400).json({
        error: true,
        message: "The course category does't exist",
      });
    }
    await courseCategory.destroy();

    const checkDefaultCategory = await CoursePerCategory.findOne({
      where: { courseId: courseId },
    });

    if (!checkDefaultCategory) {
      await CoursePerCategory.create({ categoryId: 1, courseId: courseId });
      return res.status(400).json({
        error: false,
        message: "You can delete the default category!",
      });
    }
    return res.status(200).json({
      error: false,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseWithId,
  updateCourse,
  deleteCourse,
  deleteCourseCategory,
};
