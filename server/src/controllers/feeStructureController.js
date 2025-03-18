import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all fee structures, optionally filtered by schoolId
export const getAllFeeStructures = async (req, res) => {
  try {
    const { schoolId } = req.query;
    
    const filter = schoolId ? { where: { schoolId: parseInt(schoolId) } } : {};
    
    const feeStructures = await prisma.feeStructure.findMany({
      ...filter,
      include: {
        categories: true,
      },
      orderBy: {
        className: 'asc',
      },
    });

    return res.status(200).json(feeStructures);
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return res.status(500).json({ message: 'Failed to fetch fee structures', error: error.message });
  }
};

// Get a single fee structure by id
export const getFeeStructureById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!feeStructure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }

    return res.status(200).json(feeStructure);
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    return res.status(500).json({ message: 'Failed to fetch fee structure', error: error.message });
  }
};

// Create a new fee structure
export const createFeeStructure = async (req, res) => {
  try {
    const { className, description, schoolId = 1, categories = [], totalAnnualFee = 0 } = req.body;
    
    if (!className) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    // Begin a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (prisma) => {
      // Create the fee structure
      const feeStructure = await prisma.feeStructure.create({
        data: {
          className,
          description,
          schoolId: schoolId ? parseInt(schoolId) : 1, // Default to school ID 1 if not provided
          totalAnnualFee: parseFloat(totalAnnualFee),
        },
      });

      // If categories are provided, create them
      if (categories.length > 0) {
        await Promise.all(
          categories.map((category) =>
            prisma.feeCategory.create({
              data: {
                name: category.name,
                amount: parseFloat(category.amount),
                frequency: category.frequency,
                description: category.description,
                structureId: feeStructure.id,
              },
            })
          )
        );
      }

      // Return the created fee structure with its categories
      return prisma.feeStructure.findUnique({
        where: { id: feeStructure.id },
        include: { categories: true },
      });
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating fee structure:', error);
    return res.status(500).json({ message: 'Failed to create fee structure', error: error.message });
  }
};

// Update an existing fee structure
export const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, description, schoolId, categories, totalAnnualFee } = req.body;
    
    // First check if the fee structure exists
    const existingStructure = await prisma.feeStructure.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!existingStructure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }

    // Begin a transaction for updating
    const result = await prisma.$transaction(async (prisma) => {
      // Update the fee structure basic info
      const updatedStructure = await prisma.feeStructure.update({
        where: { id },
        data: {
          className: className || existingStructure.className,
          description: description !== undefined ? description : existingStructure.description,
          // Keep existing schoolId if not provided, or use schoolId=1 as fallback
          schoolId: schoolId ? parseInt(schoolId) : (existingStructure.schoolId || 1),
          totalAnnualFee: totalAnnualFee !== undefined ? parseFloat(totalAnnualFee) : existingStructure.totalAnnualFee,
        },
      });

      // If categories are provided, handle them
      if (categories && Array.isArray(categories)) {
        // Delete existing categories to replace them with new ones
        await prisma.feeCategory.deleteMany({
          where: { structureId: id },
        });

        // Create the new categories
        await Promise.all(
          categories.map((category) =>
            prisma.feeCategory.create({
              data: {
                name: category.name,
                amount: parseFloat(category.amount),
                frequency: category.frequency,
                description: category.description,
                structureId: id,
              },
            })
          )
        );
      }

      // Return the updated fee structure with its categories
      return prisma.feeStructure.findUnique({
        where: { id },
        include: { categories: true },
      });
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating fee structure:', error);
    return res.status(500).json({ message: 'Failed to update fee structure', error: error.message });
  }
};

// Delete a fee structure
export const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the fee structure exists
    const existingStructure = await prisma.feeStructure.findUnique({
      where: { id },
    });

    if (!existingStructure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }

    // Delete the fee structure (categories will be cascaded automatically due to relation setup)
    await prisma.feeStructure.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Fee structure deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee structure:', error);
    return res.status(500).json({ message: 'Failed to delete fee structure', error: error.message });
  }
};

// Get all fee categories
export const getAllFeeCategories = async (req, res) => {
  try {
    const feeCategories = await prisma.feeCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Extract unique category names
    const uniqueCategories = [...new Set(feeCategories.map(cat => cat.name))];
    
    return res.status(200).json(uniqueCategories);
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    return res.status(500).json({ message: 'Failed to fetch fee categories', error: error.message });
  }
}; 