const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let allowedRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: allowedRoles
    },
    google:{
        type: Boolean,
        default: false
    },
    active:{
        type: Boolean,
        default: true  
    }
});


// delete password from user schema to avoid return it
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Add plugin to unique fields validation
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

// exports model user with user schema configuration
module.exports = mongoose.model('User', userSchema)