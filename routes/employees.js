const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const router = express.Router();

require('../model/Employee');
const Employee = mongoose.model('employees');

//@desc GET all employees
router.get('/', (req, res) => {
  Employee.find({})
  .sort({date: 'desc'})
  .then(employees => {
    res.status(200).render('employee/index', {
      employees: employees,
      viewTitle: 'Employees List'
    });
  })
  .catch(err => {
    if(err) throw err;
  });
});

//@desc Employee add form
router.get('/new', (req, res) => {
  res.render('employee/add', {
    viewTitle: 'Insert Employee Record'
  });
});

//@desc POST employee
router.post('/', (req, res) => {
  const {error} = validateEmployee(req.body);

  if(error) return res.status(400).render('employee/add', {
    error: error.details[0].message,
    name: req.body.name,
    email: req.body.email,
    job: req.body.job,
    phone: req.body.phone,
    city: req.body.city
  });

  const newEmployee = new Employee({
    name: req.body.name,
    email: req.body.email,
    job: req.body.job,
    phone: req.body.phone,
    city: req.body.city
  });

  newEmployee.save()
  .then(employee => {
    res.status(302).redirect('/employees');
  })
  .catch(err => {
    if(err) throw err;
  });
});

//@desc GET edit form
router.get('/edit/:id', (req, res) => {
  Employee.findOne({
    _id: req.params.id
  })
  .then(employee => {
    res.status(200).render('employee/edit', {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      job: employee.job,
      phone: employee.phone,
      city: employee.city,
      viewTitle: 'Update Employee Record'
    });
  })
  .catch(err => {
    if(err) throw err;
  });
});

//@desc  to update employee
router.put('/edit/:id', (req, res) => {
  Employee.findOne({ 
    _id: req.body.id 
  })
  .then(employee => {
    if(!employee) return res.status(404).redirect('/employees', {
      error: 'The employee with the given ID was not found'
    });

    const { error } = validateEmployee(req.body);

    if(error) return res.status(400).render('employee/edit', {
      employee: employee,
      error: error.details[0].message,
      name: req.body.name,
      email: req.body.email,
      job: req.body.job,
      phone: req.body.phone,
      city: req.body.city 
    });

    employee.name = req.body.name;
    employee.email = req.body.email;
    employee.job = req.body.job;
    employee.phone = req.body.phone;
    employee.city = req.body.city;

    employee.save()
    .then(() => {
      res.status(200).redirect('/employees');
    })
    .catch(err => {
      if(err) throw err;
    });

  })
  .catch(err => {
    if(err) throw err;
  });
});

//Function to validate input
function validateEmployee(employee){
  const schema = Joi.object({
    name: Joi.string().min(5).max(254).required(),
    email: Joi.string().email().required(),
    job: Joi.string().min(5).max(254).required(),
    phone: Joi.string().min(10).max(10).required(),
    city: Joi.string().min(3).max(254).required()
  });

  return schema.validate(employee);
};

module.exports = router;