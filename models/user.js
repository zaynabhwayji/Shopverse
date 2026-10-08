const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true, minlength: 6, select: false },
role: { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true });
// hash the password automatically BEFORE every save
userSchema.pre("save", async function () {
if (!this.isModified("password")) return; // skip if unchanged
this.password = await bcrypt.hash(this.password, 10);
});
// helper used on login to compare a typed password
userSchema.methods.matchPassword = function (entered) {
return bcrypt.compare(entered, this.password);
};
module.exports = mongoose.model("User", userSchema);
