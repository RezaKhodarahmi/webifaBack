const Categories = require("../../../../models").Categories;
const Validation = require("../../../../utils/dashboard/validationSchema");

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll();
    return res.status(200).json({
      error: false,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const { err } = Validation.CreateCategoryBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const category = await Categories.findOne({ where: { slug: data.slug } });
    if (category) {
      return res.status(400).json({
        error: true,
        message: "Duplicate Slug",
      });
    }
    var image = null;
    if (req.file) {
      image = process.env.BASE_URL + "/" + req.file.path;
    }
    await Categories.create({
      ...data,
      image,
    });
    return res.status(201).json({
      error: false,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};
const getCategoryWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const { err } = Validation.GetCategoryWithId(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const category = await Categories.findOne({ where: { id } });
    if (!category) {
      return res.status(400).json({
        error: true,
        message: "Category with this id doesn't exist!",
      });
    }
    return res.status(200).json({
      error: false,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const data = req.body;
    const { err } = Validation.UpdateCategoryBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const category = await Categories.findOne({ where: { id: data.id } });
    if (!category) {
      return res.status(400).json({
        error: true,
        message: "Category with this id doesn't exist!",
      });
    }

    if (category.id === 1) {
      data.slug = category.slug;
      data.status = category.status;
      data.parentId = category.parentId;

      if (req.file) {
        data.image = process.env.BASE_URL + "/" + req.file.path;
      }
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          category[key] = data[key];
        }
      }
      await category.save();
      return res.status(201).json({
        error: false,
        message: "The category updated successfully.",
      });
    } else {
      const slugExists = await Categories.findOne({
        where: { slug: data.slug },
      });
      if (slugExists && slugExists.id !== category.id) {
        return res.status(400).json({
          error: true,
          message: "Category with this slug already exists!",
        });
      }
      if (req.file) {
        data.image = process.env.BASE_URL + "/" + req.file.path;
      }
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          category[key] = data[key];
        }
      }
      await category.save();
      return res.status(201).json({
        error: false,
        message: "The category updated successfully.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Categories.findOne({ where: { id } });
    if (!category) {
      return res.status(400).json({
        error: true,
        message: "Category with this id not found!",
      });
    }
    if (category.id === 1) {
      return res.status(401).json({
        error: true,
        message: "You can't delete the default category!",
      });
    }

    await category.destroy();

    return res.status(201).json({
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
  createCategory,
  getCategories,
  getCategoryWithId,
  updateCategory,
  deleteCategory,
};
