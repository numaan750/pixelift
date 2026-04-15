import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import loginSchema from "../models/login.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔍 Google Profile received:", profile.displayName);
        console.log("📧 Email:", profile.emails[0].value);
        console.log("🆔 Google ID:", profile.id);

        const email = profile.emails[0].value;
        const googleId = profile.id;
        let user = await loginSchema.findOne({ email });

        if (user) {
          console.log("✅ User found with this email");
          if (!user.googleId) {
            console.log("🔗 Linking Google account to existing user");
            user.googleId = googleId;
            if (!user.profilePicture && profile.photos && profile.photos[0]) {
              user.profilePicture = profile.photos[0].value;
            }

            await user.save();
            console.log("✅ Google account linked successfully");
          } else {
            console.log("✅ Google account already linked");
          }

          return done(null, user);
        }
        console.log("Creating new Google user");
        user = await loginSchema.create({
          googleId: googleId,
          email: email,
          username: profile.displayName,
          provider: "google",
          credits: 1,
          profilePicture:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
        });

        console.log("✅ New Google user created:", user._id);
        done(null, user);
      } catch (error) {
        console.error("❌ Google Strategy Error:", error);
        console.error("Error details:", error.message);
        done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("📝 Serializing user:", user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await loginSchema.findById(id);
    console.log("📖 Deserializing user:", user?._id);
    done(null, user);
  } catch (error) {
    console.error("❌ Deserialize error:", error);
    done(error, null);
  }
});

export default passport;
