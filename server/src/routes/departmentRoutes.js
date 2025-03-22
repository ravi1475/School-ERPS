import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Add route to get student by admission number
router.get('/school/administration/departments', async (req, res) => {
    try {
      const departments = await prisma.department.findMany();
  
      if (!departments) {
        return res.status(404).json({
          success: false,
          message: 'No departments found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: departments.map((dept) => ({
          ...dept,
          createdAt: dept.createdAt, // Include createdAt in the response
        })),
      });
    } catch (error) {
      console.error('Error finding departments:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving departments',
        error: error.message,
      });
    }
  });


router.post('/school/administration/departments', async (req, res) => {
    try {
      const { departmentName, hOD, faculty_count, description } = req.body;
  
      const newDepartment = await prisma.department.create({
        data: {
          departmentName,
          hOD,
          faculty_count,
          description,
          schoolId: 1, // Assuming schoolId is hardcoded for now
        },
      });
  
      res.status(201).json({
        success: true,
        message: 'Department added successfully',
        data: {
          ...newDepartment,
          createdAt: newDepartment.createdAt, // Include createdAt in the response
        },
      });
    } catch (error) {
      console.error('Error adding department:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding department',
        error: error.message,
      });
    }
  });

  router.put('/school/administration/departments/:id', async (req, res) => {
    try {
        console.log("id");
      const { id } = req.params;
      const { departmentName, hOD, faculty_count, description } = req.body;
  
      const updatedDepartment = await prisma.department.update({
        where: { id: parseInt(id) },
        data: {
          departmentName,
          hOD,
          faculty_count,
          description,
          schoolId: 1, // Assuming schoolId is hardcoded for now
        },
      });
  
      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: {
          ...updatedDepartment,
          createdAt: updatedDepartment.createdAt, // Include createdAt in the response
        },
      });
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating department',
        error: error.message,
      });
    }
  });


  router.get('/school/administration/departments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const department = await prisma.department.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          ...department,
          createdAt: department.createdAt, // Include createdAt in the response
        },
      });
    } catch (error) {
      console.error('Error retrieving department:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving department',
        error: error.message,
      });
    }
  });


  router.delete('/school/administration/departments/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedDepartment = await prisma.department.delete({
        where: { id: parseInt(id) },
      });

      if(!deletedDepartment){
        res.status(404).json({
            success : false,
            message : "Deparment Not get deleted"
        })

      }

      res.status(200).json({
        success: true,
        message: 'Department deleted successfully',
        data: {
          ...deletedDepartment,
          createdAt: deletedDepartment.createdAt, // Include createdAt in the response
        },
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting department',
        error: error.message,
      });
    }
  });


export default router;