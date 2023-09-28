const mongoose = require('mongoose'); 
  
const imageSchema = new mongoose.Schema({ 
    image: { 
        type: String
    } 
}, {timestamps: true});

const Image = new mongoose.model('Image', imageSchema, 'Image'); 
module.exports = Image;