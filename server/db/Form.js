const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const FormSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  description: {
    type: String,
    default: ""
  },
  questions : [{
    questionId: String,
    open: {type: Boolean, default: false},
    questionText: String,
    questionImage: {type: String, default: ""},
    options: [{
      optionText : String,
      optionImage: {type: String, default: ""},
    }],
    isRequired: {type: Boolean, default: false},
  }],
  stared : {type: Boolean, default : false},
  formType: {type: String, default: "anonymous" }
 }, {timestamps: true});

FormSchema.plugin(mongoosePaginate);

const Form = new mongoose.model('Form', FormSchema, 'Form');
module.exports = Form; 
