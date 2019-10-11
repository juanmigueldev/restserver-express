const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    unitPrice: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    creatorUser: { type: Schema.Types.ObjectId, ref: 'User' }
});

// Add plugin to unique fields validation
productSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

// exports model user with user schema configuration
module.exports = mongoose.model('Product', productSchema)