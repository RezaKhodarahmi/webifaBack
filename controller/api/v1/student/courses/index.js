const Courses = require("../../../../../models").Courses;
const CourseCycles = require("../../../../../models").CourseCycles;
const Categories = require("../../../../../models").Categories;
const Users = require("../../../../../models").Users;
const Videos = require("../../../../../models").Videos;
const Answers = require("../../../../../models").Answers;
const Enrollments = require("../../../../../models").Enrollments;
const Tests = require("../../../../../models").Tests;
const Questions = require("../../../../../models").Questions;

const Validation = require("../../../../../utils/dashboard/validationSchema");
const getCourses = async (req, res) => {
  try {
    const courses = await Courses.findAll({
      where: { status: 1 },
      include: [
        {
          model: CourseCycles,
          as: "cycles",
          required: true,
        },
        {
          model: Users,
          as: "teachers",
          attributes: {
            exclude: [
              "password",
              "email",
              "referralCode",
              "phone",
              "address",
              "postalCode",
              "country",
              "city",
              "role",
              "language",
              "timezone",
              "emailVerification",
              "dateOfBirth",
              "status",
              "vip",
              "registerStep",
              "token",
              "forgotToken",
              "contract",
              "referralCode",
              "credit",
              "updatedAt",
              "createdAt",
              "stripeCustomerId",
            ],
          },
        },
        {
          model: Categories,
          as: "categories",
        },
      ],
    });
    const category = await Categories.findAll({
      where: { status: 1 },
    });
    const teacher = await Users.findAll({
      where: { role: 1000 },
      attributes: {
        exclude: [
          "password",
          "email",
          "referralCode",
          "phone",
          "address",
          "postalCode",
          "country",
          "city",
          "role",
          "language",
          "timezone",
          "emailVerification",
          "dateOfBirth",
          "status",
          "vip",
          "registerStep",
          "token",
          "forgotToken",
          "contract",
          "referralCode",
          "credit",
          "updatedAt",
          "createdAt",
          "stripeCustomerId",
        ],
      },
    });
    return res.status(200).json({
      error: false,
      data: courses,
      category: category,
      teacher: teacher,
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
    const slug = req.params.slug;
    const { err } = Validation.GetCourseWithId(slug);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const course = await Courses.findOne({
      where: { slug, status: 1 },
      include: [
        {
          model: CourseCycles,
          as: "cycles",
          required: true,
        },
        {
          model: Categories, // Include Categories model
          as: "categories", // Alias as defined in the association
        },
        {
          model: Users,
          as: "teachers",
          attributes: {
            exclude: [
              "password",
              "email",
              "referralCode",
              "phone",
              "address",
              "postalCode",
              "country",
              "city",
              "role",
              "language",
              "timezone",
              "emailVerification",
              "dateOfBirth",
              "status",
              "vip",
              "registerStep",
              "token",
              "forgotToken",
              "contract",
              "referralCode",
              "credit",
              "updatedAt",
              "createdAt",
              "stripeCustomerId",
            ],
          },
        },
        {
          model: Tests,
          as: "tests",
        },
        {
          model: Videos,
          as: "videos",
        },
      ],
    });

    if (!course) {
      return res.status(400).json({
        error: true,
        message: "Course with this slug doesn't exist!",
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

const getCartItem = async (req, res) => {
  try {
    var { items } = req.body;

    //define cart items
    var cartItems = [];

    //find course's
    items = JSON.parse(items);
    for (const item of Object(items)) {
      const course = await CourseCycles.findOne({
        where: { id: item, status: 1 },
        include: [
          {
            model: Courses,
            as: "course",
          },
        ],
      });
      if (course) {
        const oldItems = [...cartItems];
        oldItems.push(course);
        cartItems = oldItems;
      }
    }

    if (cartItems.length < 1) {
      return res.status(400).json({
        error: true,
        message: "Cart is empty!",
      });
    }

    return res.status(200).json({
      error: false,
      data: cartItems,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};
const getTests = async (req, res) => {
  try {
    const { slug } = req.params;
    const tests = await Tests.findOne({
      where: { slug, status: 1 },
      include: [
        {
          model: Questions,
          as: "questions",
          include: [
            {
              model: Answers,
              as: "answers",
            },
          ],
        },
      ],
    });

    res.json(tests);
  } catch (err) {
    res.status(500).send({
      error: "An error occurred while fetching the data.",
    });
  }
};

const checkEnroll = async (req, res) => {
  try {
    const { cycleId, user } = req.body;

    const userData = await Users.findOne({ where: { email: user } });
    if (!userData) {
      return res.status(401).json({
        error: true,
        message: "User not found!",
      });
    }
    const isEnrolled = await Enrollments.findOne({
      where: { cycleId, userId: userData.id },
    });

    if (isEnrolled) {
      const enrollmentDate = new Date(isEnrolled.enrollmentDate);
      // Add 8 months to the enrollment date
      const expirationDate = new Date(enrollmentDate);
      expirationDate.setMonth(expirationDate.getMonth() + 8);

      // Calculate the difference between the expiration date and the current date
      const currentDate = new Date();
      const timeDiff = expirationDate - currentDate;
      const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (remainingDays > 0) {
        return res.json({
          enrolled: true,
          remainingDays: remainingDays,
        });
      } else {
        return res.json({
          enrolled: false,
          message: "Enrollment has expired.",
        });
      }
    } else {
      return res.json({
        enrolled: false,
        message: "User is not enrolled in this cycle.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while checking enrollment.",
    });
  }
};
const GetCourseCheckEnroll = async (req, res) => {
  try {
    const { course, user } = req.body;

    const { err } = Validation.GetCourseWithId(course);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const existedCourse = await Courses.findOne({
      where: { slug: course, status: 1 },
      include: [
        {
          model: CourseCycles,
          as: "cycles",
          required: true,
        },
        {
          model: Categories, // Include Categories model
          as: "categories", // Alias as defined in the association
        },
        {
          model: Users,
          as: "teachers",
          attributes: {
            exclude: [
              "password",
              "email",
              "referralCode",
              "phone",
              "address",
              "postalCode",
              "country",
              "city",
              "role",
              "language",
              "timezone",
              "emailVerification",
              "dateOfBirth",
              "status",
              "vip",
              "registerStep",
              "token",
              "forgotToken",
              "contract",
              "referralCode",
              "credit",
              "updatedAt",
              "createdAt",
              "stripeCustomerId",
            ],
          },
        },
        {
          model: Tests,
          as: "tests",
        },
        {
          model: Videos,
          as: "videos",
        },
      ],
    });

    if (!existedCourse) {
      return res.status(400).json({
        error: true,
        message: "Course with this slug doesn't exist!",
      });
    }

    const userData = await Users.findOne({
      where: { email: JSON.parse(user) },
    });
    if (!userData) {
      return res.status(401).json({
        error: true,
        message: "User not found!",
      });
    }
    const isEnrolled = await Enrollments.findOne({
      where: { cycleId: existedCourse.cycles[0].id, userId: userData.id },
    });

    if (isEnrolled) {
      const enrollmentDate = new Date(isEnrolled.enrollmentDate);
      // Add 8 months to the enrollment date
      const expirationDate = new Date(enrollmentDate);
      expirationDate.setMonth(expirationDate.getMonth() + 8);

      // Calculate the difference between the expiration date and the current date
      const currentDate = new Date();
      const timeDiff = expirationDate - currentDate;
      const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (remainingDays > 0) {
        return res.json({
          data: existedCourse,
          enrolled: true,
          remainingDays: remainingDays,
        });
      } else {
        return res.json({
          enrolled: false,
          error: false,
          data: existedCourse,
        });
      }
    } else {
      return res.json({
        enrolled: false,
        error: false,
        data: existedCourse,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "An error occurred while checking enrollment.",
    });
  }
};
module.exports = {
  getCourses,
  getCourseWithId,
  getCartItem,
  getTests,
  checkEnroll,
  GetCourseCheckEnroll,
};
