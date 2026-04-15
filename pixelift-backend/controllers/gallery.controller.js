import GenerationModel from "../models/Generation.model.js";

export const getGallery = async (req, res) => {
  try {
    const userId = req.user._id;

    const generations = await GenerationModel.find({ userId })
      .select("imageUrl uploadedImage toolId createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: "success",
      gallery: generations,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
