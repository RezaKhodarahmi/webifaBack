const BlogCategories = require("../../../../models").BlogCategories;
const PostCategory = require("../../../../models").PostCategory;
const Validation = require("../../../../utils/dashboard/validationSchema");

const getCategories = async (req, res) => {
  try {
    const categories = await BlogCategories.findAll();
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
    const { err } = Validation.CreateBlogCategoryBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const category = await BlogCategories.findOne({
      where: { slug: data.slug },
    });
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
    await BlogCategories.create({
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
    const category = await BlogCategories.findOne({ where: { id } });
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
    const { err } = Validation.updateBlogCategoryBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const category = await BlogCategories.findOne({ where: { id: data.id } });
    if (!category) {
      return res.status(400).json({
        error: true,
        message: "Category with this id doesn't exist!",
      });
    }
    if (category.id === 1) {
      category.title = data.title;
      category.description = data.description;
      category.keywords = data.keywords;
      category.metaTitle = data.metaTitle;
      category.metaDescription = data.metaDescription;
      category.image = data.image;
      await category.save();
      return res.status(200).json({
        error: false,
        message: "The category updated successfully.",
      });
    }
    const slugExists = await BlogCategories.findOne({
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
    const category = await BlogCategories.findOne({ where: { id } });
    if (!category) {
      return res.status(400).json({
        error: true,
        message: "Category with this id not found!",
      });
    }
    if (category.id === 1) {
      return res.status(401).json({
        error: true,
        message: "This the default category cannot be deleted.",
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

const deletePostCategory = async (req, res) => {
  try {
    const params = req.body;
    const existCategory = await PostCategory.findOne({
      where: { catId: params.catId, postId: params.postId },
    });

    if (!existCategory) {
      return res.status(401).json({
        error: true,
        message: "This post doesn't contain this category.",
      });
    }

    await existCategory.destroy();
    const checkIfHaveDefaultCategory = await PostCategory.findOne({
      where: { postId: params.postId },
    });
    if (!checkIfHaveDefaultCategory) {
      await PostCategory.create({ postId: params.postId, catId: 1 });
      return res.status(401).json({
        error: false,
        message: "Category deleted and default category added",
      });
    }
    return res.status(201).json({
      error: false,
      message: "The category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  getCategoryWithId,
  updateCategory,
  deleteCategory,
  deletePostCategory,
};
