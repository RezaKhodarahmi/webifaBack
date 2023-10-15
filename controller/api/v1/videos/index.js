//Import Model
const Videos = require("../../../../models").Videos;
const Validation = require("../../../../utils/dashboard/validationSchema");
const VideoPerCycle = require("../../../../models").VideoPerCycle;

//Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await Videos.findAll();
    if (!videos) {
      return res.status(400).json({
        error: true,
        message: "There is no video to show",
      });
    }

    return res.status(200).json({
      error: false,
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

// Create new video
const creteNewVideo = async (req, res) => {
  try {
    const params = req.body;
    //Validate req body
    const { err } = Validation.createNewVideo(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    existedVideo = await Videos.findOne({
      where: {
        courseId: params.courseId,
        secId: params.secId,
        cycleId: params.cycleId,
      },
    });
    if (existedVideo) {
      return res.status(400).json({
        error: true,
        message: "Video With This 'section Id' created before.",
      });
    }
    const video = await Videos.create(params);
    await VideoPerCycle.create({
      courseId: params.courseId,
      videoId: video.id,
      cycleId: params.cycleId,
    });
    return res.status(201).json({
      error: false,
      message: "The video created successfully",
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

//Get video using ID
const getVideoWithId = async (req, res) => {
  try {
    const id = req.params.id;
    //Validate if Id is valid
    const { err } = Validation.getVideoWithId(id);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const video = await Videos.findOne({ where: { id } });
    if (!video) {
      return res.status(400).json({
        error: true,
        message: "Video with this ID doesn't exist!",
      });
    }
    return res.status(200).json({
      error: false,
      data: video,
    });
  } catch (error) {}
};

//Update video
const updateVideo = async (req, res) => {
  try {
    const params = req.body;

    //Validate req body
    const { err } = Validation.updateVideoValidation(params);
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.details[0].message,
      });
    }

    const Video = await Videos.findOne({ where: { id: params.id } });

    //If req has Invalid id return the json message
    if (!Video) {
      return res.status(400).json({
        error: true,
        message: `Videos with these IDs don't exist:${params.id} }`,
      });
    }

    await Video.update(params);
    const videoPerCycle = await VideoPerCycle.findOne({
      where: { videoId: params.id },
    });
    if (videoPerCycle) {
      videoPerCycle.cycleId = params.cycleId;
      videoPerCycle.courseId = params.courseId;

      await videoPerCycle.save();
    } else {
      await VideoPerCycle.create({
        courseId: params.courseId,
        videoId: Video.id,
        cycleId: params.cycleId,
      });
    }
    return res.status(200).json({
      error: false,
      message: "The video updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server Error!",
    });
  }
};

// Delete video with ID
const deleteVideo = async (req, res) => {
  try {
    const id = req.params.id;
    //Validate if ID is valid
    const { err } = Validation.deleteVideoWithId(id);
    if (err) {
      return res.status(401).json({
        error: true,
        message: err.details[0].message,
      });
    }
    const video = await Videos.findOne({ where: { id } });
    if (!video) {
      return res.status(401).json({
        error: true,
        message: "Video not founded!",
      });
    }
    await video.destroy();
    const videoPerCycle = await VideoPerCycle.findOne({
      where: { videoId: id },
    });
    if (videoPerCycle) {
      await videoPerCycle.destroy();
    }
    return res.status(200).json({
      error: false,
      message: "The video deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error",
    });
  }
};

//Export functions
module.exports = {
  getVideos,
  creteNewVideo,
  updateVideo,
  deleteVideo,
  getVideoWithId,
};
