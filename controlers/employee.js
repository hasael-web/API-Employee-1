const Employees = require('../models/employee');
const { StatusCodes } = require('http-status-codes');
const moment = require('moment');
const CustomError = require('../errors');

const getAllEmployees = async (req, res) => {
  const employees = await Employees.find({});
  res.status(StatusCodes.OK).json({ employees, count: employees.length });
};

const createEmployee = async (req, res) => {
  // const { name, status, active, startDate, endDate } = req.body;

  // let dueDate = [];

  // dueDate.push(startDate, endDate);

  const employee = await Employees.create(req.body);

  res.status(StatusCodes.CREATED).json({ employee });
};

const getFilterest = async (req, res) => {
  const { name, active, startDate, endDate, status, divisi } = req.query;
  try {
    const queryObject = {};
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' };
    }
    if (active) {
      queryObject.active = active === 'true' ? true : false;
    }
    if (divisi) {
      const divisiArray = divisi.split(',');
      queryObject.divisi = { $in: divisiArray };
    }

    if (status) {
      queryObject.status = status;
    }

    // console.log('Received startDate:', startDate);
    // console.log('Received endDate:', endDate);

    if (startDate && endDate) {
      queryObject['deuDate.startDate'] = { $lte: endDate };
      queryObject['deuDate.endDate'] = { $gte: startDate };
    }

    // console.log(queryObject);
    const employee = await Employees.find(queryObject);
    // console.log(employee);

    res.status(200).json({ employee, count: employee.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getAllEmployees, createEmployee, getFilterest };
