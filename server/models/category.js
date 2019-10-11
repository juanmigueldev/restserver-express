const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        unique: true
    },
    creatorUser:{
        type: Schema.Types.ObjectId,
        ref: 'User'     
    }
});


// Add plugin to unique fields validation
categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

// exports model user with user schema configuration
module.exports = mongoose.model('Category', categorySchema)