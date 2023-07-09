import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: String,
        password: String
    }
);

userSchema.plugin(passportLocalMongoose);

const userModel = mongoose.model("_User", userSchema);
