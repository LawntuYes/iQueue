import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    passwordHash: { //Hello there! my password is Hashed and now you don't know it :D
        type: String,
        required: true
    },
}, {timestamps: true});
// export default mongoose.model('User', userSchema);
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.passwordHash; // Exclude passwordHash from the returned object
    return userObject;
};
export const User = mongoose.model('User', userSchema);