const BlogTags = require("../../../../models").BlogTags;
const Validation = require("../../../../utils/dashboard/validationSchema");
const PostTag = require("../../../../models").PostTag;

const getTags = async (req, res) => {
  try {
    const tags = await BlogTags.findAll();
    return res.status(200).json({
      error: false,
      data: tags,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const createTag = async (req, res) => {
  try {
    const data = req.body;
    const { err } = Validation.CreateTagBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    // const tag = await BlogTags.findOne({ where: { title: data.title } });
    // if (tag) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "This tag duplicate!",
    //     data: tag,
    //   });
    // }

    const newTag = await BlogTags.create(data);
    await PostTag.create({ tagId: newTag.id, postId: data.postId });
    return res.status(201).json({
      error: false,
      message: "Tag created successfully",
      data: newTag,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};
const getTagWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await BlogTags.findOne({ where: { id } });
    if (!tag) {
      return res.status(400).json({
        error: true,
        message: "Tag with this id doesn't exist!",
      });
    }
    return res.status(200).json({
      error: false,
      data: tag,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const updateTag = async (req, res) => {
  try {
    const data = req.body;
    const { err } = Validation.UpdateTagBodyValidation(data);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const tag = await BlogTags.findOne({ where: { id: data.id } });
    if (!tag) {
      return res.status(400).json({
        error: true,
        message: "Tag with this id doesn't exist!",
      });
    }
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        tag[key] = data[key];
      }
    }
    await tag.save();
    return res.status(201).json({
      error: false,
      message: "The category updated successfuly.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { postId, tagId } = req.body;
    const tag = await PostTag.findOne({ where: { tagId, postId } });
    if (!tag) {
      return res.status(400).json({
        error: true,
        message: "،Tag with this ID doesn't exist!",
      });
    }

    await tag.destroy();

    return res.status(201).json({
      error: false,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};

module.exports = {
  getTags,
  createTag,
  getTagWithId,
  updateTag,
  deleteTag,
};
