const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"],
        minLength:[6, "Password must be atleast 6 length characters"]
    },
    role: {
        type: Boolean,
    },
    phoneNumber:{
        type:Number,
        required:[true, "Please enter your 10 numbered phone number!"],
        trim: true,
    },
    date:{
        type:Date,
        required:true
    }
}, {
    timestamps: true
})

module.exports= mongoose.model("Users", userSchema)
