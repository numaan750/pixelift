import loginSchema from "../models/login.js";

export const activateFakePremium = async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // const expiryTime = new Date(Date.now() + 5 * 60 * 1000);  //5 minutes
    // const expiryTime = new Date(Date.now() + 1 * 60 * 1000);  //1 minute
    // const expiryTime = new Date(Date.now() + 2 * 60 * 1000); //2 minutes

    await loginSchema.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumExpiryDate: expiryTime,
    });

    res.status(200).json({
      status: "success",
      message: `Pixelift Premium activated (${plan} plan)`,
      premiumExpiryDate: expiryTime,
      isPremium: true,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const checkPremiumStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await loginSchema.findById(userId);

    if (
      user.isPremium &&
      user.premiumExpiryDate &&
      new Date() > user.premiumExpiryDate
    ) {
      await loginSchema.findByIdAndUpdate(userId, {
        isPremium: false,
        premiumExpiryDate: null,
      });
      return res.status(200).json({
        status: "success",
        isPremium: false,
        expired: true,
      });
    }

    res.status(200).json({
      status: "success",
      isPremium: user.isPremium,
      premiumExpiryDate: user.premiumExpiryDate,
      expired: false,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
