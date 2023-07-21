import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "Username is required"],
            unique: [true, "Username is already taken"]
        },
        password: {
            type: String,
            require: [true, "Password is required"]
        }
    }
);

const userModel = mongoose.model("User", userSchema);

export {userModel};
