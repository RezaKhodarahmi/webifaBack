//Import Model
const Posts = require("../../../../models").Posts;
const Validation = require("../../../../utils/dashboard/validationSchema");
const BlogCategories = require("../../../../models").BlogCategories;
const BlogTags = require("../../../../models").BlogTags;
const PostTag = require("../../../../models").PostTag;
const PostCategory = require("../../../../models").PostCategory;
const { Op } = require("sequelize");

//Check the slug duplicate and change it if it's duplicate
const adjustSlug = async (originalSlug) => {
  let newSlug;
  let found = false;
  let i = 1;

  while (!found) {
    newSlug = originalSlug + "-" + i;
    const existingPost = await Posts.findOne({ where: { slug: newSlug } });

    if (!existingPost) {
      found = true;
    } else {
      i++;
    }
  }
  return newSlug;
};
//Get all post form database
const getPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll();
    return res.status(200).json({
      error: false,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const getPostWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findOne({
      where: { id },
      include: [{ model: BlogTags }, { model: BlogCategories }],
    });
    if (!post) {
      return res.status(400).json({
        error: true,
        message: "Post with this ID doesn't exist!",
      });
    }
    return res.status(200).json({
      error: false,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};
const creteNewPost = async (req, res) => {
  try {
    const { cats, tags, ...params } = req.body;

    const { err } = Validation.updatePostBodyValidation(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: "error",
      });
    }
    //Check if slug is exist
    const checkExistingPost = await Posts.findOne({
      where: { slug: params.slug },
    });
    if (checkExistingPost) {
      return res.status(400).json({
        error: true,
        message: "Duplicate slug",
      });
    }
    var image = "";
    if (req.file) {
      image = process.env.BASE_URL + "/" + req.file.path;
    }
    const post = await Posts.create({ ...params, image: image });

    const arrayTags = JSON.parse(tags);
    if (arrayTags) {
      for (const tag of arrayTags) {
        const newTag = await BlogTags.create({
          title: JSON.stringify(tag["title"]),
        });
        await PostTag.create({ tagId: newTag.id, postId: post.id });
      }
    }

    const arrayData = JSON.parse(cats);
    if (arrayData) {
      // First, create or update all categories in the array
      for (const category of arrayData) {
        if (category) {
          const [postCategory, created] = await PostCategory.findOrCreate({
            where: {
              catId: JSON.stringify(category["value"]),
              postId: post.id,
            },
            defaults: {
              catId: JSON.stringify(category["value"]),
              postId: parseInt(post.id),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          if (!created) {
            postCategory.updatedAt = new Date();
            await postCategory.save();
          }
        }
      }

      // Then, remove any categories not in the array
      const catIds = arrayData.map((category) =>
        JSON.stringify(category["value"])
      );
      await PostCategory.destroy({
        where: {
          postId: post.id,
          catId: {
            [Op.notIn]: catIds,
          },
        },
      });
    }

    return res.status(201).json({
      error: false,
      message: "Post created successfully.",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id, cats: categories, tags, ...params } = req.body;
    const postId = id;

    const { err } = Validation.updatePostBodyValidation(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: "error",
      });
    }

    const post = await Posts.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(400).json({
        error: true,
        message: "Post with this ID doesn't exist!",
      });
    }
    var image = post.image;
    if (req.file) {
      image = process.env.BASE_URL + "/" + req.file.path;
    }
    await post.update({ ...params, image: image });
    if (tags) {
      for (const tag of Object.values(tags)) {
        if (tag.id != null) {
          const existTag = await PostTag.findOne({
            where: { tagId: tag.id, postId: postId },
          });
          if (!existTag) {
            await PostTag.create(tag);
          }
        }
      }
    }

    const arrayData = JSON.parse(categories);
    if (arrayData) {
      // First, create or update all categories in the array
      for (const category of arrayData) {
        if (category) {
          const [postCategory, created] = await PostCategory.findOrCreate({
            where: { catId: JSON.stringify(category["value"]), postId: postId },
            defaults: {
              catId: JSON.stringify(category["value"]),
              postId: parseInt(postId),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          if (!created) {
            postCategory.updatedAt = new Date();
            await postCategory.save();
          }
        }
      }

      // Then, remove any categories not in the array
      const catIds = arrayData.map((category) =>
        JSON.stringify(category["value"])
      );
      await PostCategory.destroy({
        where: {
          postId: postId,
          catId: {
            [Op.notIn]: catIds,
          },
        },
      });
    }

    return res.status(201).json({
      error: false,
      message: "Post updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findOne({ where: { id } });
    if (!post) {
      return res.status(400).json({
        error: true,
        message: "Post with this ID doesn't exist!",
      });
    }
    await post.destroy();
    return res.status(200).json({
      error: false,
      message: "The post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error!",
    });
  }
};

module.exports = {
  getPosts,
  creteNewPost,
  getPostWithId,
  deletePost,
  updatePost,
};
