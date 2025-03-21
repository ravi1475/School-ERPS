// controllers/tcController.js
import { PrismaClient } from '@prisma/client';
import { TCCreateSchema, TCUpdateSchema } from '../validators/tcValidator.js';

const prisma = new PrismaClient();

// Create TC
export const createTC = async (req, res) => {
  try {
    const validatedData = TCCreateSchema.parse(req.body);
    
    const tc = await prisma.transferCertificate.create({
      data: {
        ...validatedData,
        issuedDate: new Date(),
        tcNumber: generateTCNumber(),
        tcstatus: 'Issued',
        student: { connect: { id: validatedData.studentId } },
        school: { connect: { id: validatedData.schoolId } }
      },
      include: {
        student: true,
        school: true
      }
    });
    
    res.status(201).json(tc);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all TCs
export const getAllTCs = async (req, res) => {
  try {
    const { class: studentClass, search } = req.query;
    const whereClause = {};

    if (studentClass) {
      whereClause.studentClass = studentClass;
    }

    if (search) {
      whereClause.OR = [
        { tcNo: { contains: search } },
        { studentName: { contains: search } },
        { admissionNumber: { contains: search } }
      ];
    }

    const tcs = await prisma.transferCertificate.findMany({
      where: whereClause,
      include: {
        student: true,
        school: true
      },
      orderBy: {
        issuedDate: 'desc'
      }
    });

    res.json(tcs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single TC
export const getTC = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tc = await prisma.transferCertificate.findUnique({
      where: { id: Number(id) },
      include: {
        student: true,
        school: true
      }
    });

    if (!tc) {
      return res.status(404).json({ error: 'TC not found' });
    }

    res.json(tc);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update TC
export const updateTC = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = TCUpdateSchema.partial().parse(req.body);

    const tc = await prisma.transferCertificate.update({
      where: { id: Number(id) },
      data: validatedData,
      include: {
        student: true,
        school: true
      }
    });

    res.json(tc);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete TC
export const deleteTC = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transferCertificate.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
