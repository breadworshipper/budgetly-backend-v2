import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {   
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true,
        },
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
