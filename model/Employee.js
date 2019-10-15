const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  job: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
mongoose.model('employees', EmployeeSchema);