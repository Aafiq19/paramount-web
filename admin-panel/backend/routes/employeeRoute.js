import express from 'express';
import { Employee } from '../models/employeeModel.js';

const router = express.Router();

// Create a new employee
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.employeeId ||
      !request.body.name ||
      !request.body.role ||
      !request.body.contact ||
      !request.body.email ||
      !request.body.salary
    ) {
      return response.status(400).send({
        message: 'Send all required fields: employeeId, name, role, contact, email, salary',
      });
    }

    const newEmployee = {
      employeeId: request.body.employeeId,
      name: request.body.name,
      role: request.body.role,
      contact: request.body.contact,
      email: request.body.email,
      salary: request.body.salary,
      paymentStatus: request.body.paymentStatus || 'Unpaid',
    };

    const employee = await Employee.create(newEmployee);
    return response.status(201).send(employee);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all employees
router.get('/', async (request, response) => {
  try {
    const employees = await Employee.find({});
    return response.status(200).json({
      count: employees.length,
      employees: employees,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get one employee by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const employee = await Employee.findById(id);
    return response.status(200).json(employee);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update an employee
router.put('/:id', async (request, response) => {
  try {
    if (
      !request.body.employeeId ||
      !request.body.name ||
      !request.body.role ||
      !request.body.contact ||
      !request.body.email ||
      !request.body.salary
    ) {
      return response.status(400).send({
        message: 'Send all required fields: employeeId, name, role, contact, email, salary',
      });
    }

    const { id } = request.params;
    const result = await Employee.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Employee not found' });
    }

    return response.status(200).send({ message: 'Employee updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete an employee
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Employee.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Employee not found' });
    }

    return response.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;