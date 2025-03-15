import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateFeeData } from '../utils/validators.js';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @route   GET /api/fees
 * @desc    Get all fee records
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      orderBy: { paymentDate: 'desc' }
    });
    
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch fee records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/fees/:id
 * @desc    Get fee record by id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const fee = await prisma.fee.findUnique({
      where: { id: req.params.id }
    });
    
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    console.error('Error fetching fee record:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch fee record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/fees
 * @desc    Create new fee record
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // Validate fee data
    const { error } = validateFeeData(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid fee data', 
        errors: error.details.map(d => d.message)
      });
    }

    // Parse date string to Date object
    const feeData = {
      ...req.body,
      paymentDate: new Date(req.body.paymentDate),
      totalFees: parseFloat(req.body.totalFees),
      amountPaid: parseFloat(req.body.amountPaid),
      feeAmount: parseFloat(req.body.feeAmount)
    };
    
    // Create new fee record
    const newFee = await prisma.fee.create({
      data: feeData
    });
    
    res.status(201).json({ success: true, data: newFee });
  } catch (error) {
    console.error('Error creating fee record:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create fee record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/fees/:id
 * @desc    Update fee record
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    // Check if fee exists
    const existingFee = await prisma.fee.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingFee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    // Validate fee data
    const { error } = validateFeeData(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid fee data', 
        errors: error.details.map(d => d.message)
      });
    }
    
    // Parse date string to Date object
    const feeData = {
      ...req.body,
      paymentDate: new Date(req.body.paymentDate),
      totalFees: parseFloat(req.body.totalFees),
      amountPaid: parseFloat(req.body.amountPaid),
      feeAmount: parseFloat(req.body.feeAmount)
    };
    
    // Update fee record
    const updatedFee = await prisma.fee.update({
      where: { id: req.params.id },
      data: feeData
    });
    
    res.status(200).json({ success: true, data: updatedFee });
  } catch (error) {
    console.error('Error updating fee record:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update fee record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/fees/:id
 * @desc    Delete fee record
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    // Check if fee exists
    const existingFee = await prisma.fee.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingFee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    
    // Delete fee record
    await prisma.fee.delete({
      where: { id: req.params.id }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Fee record deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting fee record:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete fee record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;