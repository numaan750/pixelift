import GenerationModel from "../models/Generation.model.js";
import loginSchema from "../models/login.js";
import { generatePixeliftImage } from "../utils/imageGenerator.js";

export const generateImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await loginSchema.findById(userId);
    if (!user.isPremium && user.credits <= 0) {
      return res.status(403).json({
        status: "error",
        needsPremium: true,
        message: "No credits left. Please upgrade to premium.",
      });
    }
    const { toolId, section, uploadedImage, toolOptions = {} } = req.body;
    if (!toolId) {
      return res.status(400).json({
        status: "error",
        message: "toolId is required",
      });
    }
    const imageUrl = await generatePixeliftImage({
      toolId,
      toolOptions,
      uploadedImage: uploadedImage || null,
    });
    await GenerationModel.create({
      userId,
      imageUrl,
      uploadedImage: uploadedImage || null,
      toolId,
      section: section || null,
      toolOptions,
    });
    if (!user.isPremium) {
      if (!user.isPremium) {
        const updatedUser = await loginSchema.findOneAndUpdate(
          { _id: userId, credits: { $gt: 0 } },
          { $inc: { credits: -1 } },
          { new: true },
        );

        if (!updatedUser) {
          return res.status(403).json({
            status: "error",
            needsPremium: true,
            message: "No credits left. Please upgrade to premium.",
          });
        }
      }
    }
    res.status(200).json({
  status: "success",
  imageUrl,
  creditsLeft: user.isPremium ? "unlimited" : updatedUser ? updatedUser.credits : 0,
});
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
