import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerStudent = async (req, res) => {
  try {
    const { body: formFields, files: uploadedFiles } = req; // Destructure request body and files
    const { formNo } = formFields;

    // Check if the student already exists
    const existingStudent = await prisma.registration.findUnique({
      where: { formNo },
    });

    if (existingStudent) {
      return res.status(400).json({ success: false, data: "Already exists" });
    }

    // Convert boolean fields
    formFields.singleParent = Boolean(formFields.singleParent);
    formFields.smsAlert = Boolean(formFields.smsAlert);
    formFields.isFatherCampusEmployee = Boolean(
      formFields.isFatherCampusEmployee
    );

    // Extract file paths
    const fileLocations = {
      casteCertificate: uploadedFiles?.casteCertificate?.[0]?.path || null,
      studentAadharCard: uploadedFiles?.studentAadharCard?.[0]?.path || null,
      fatherAadharCard: uploadedFiles?.fatherAadharCard?.[0]?.path || null,
      motherAadharCard: uploadedFiles?.motherAadharCard?.[0]?.path || null,
      previousClassMarksheet:
        uploadedFiles?.previousClassMarksheet?.[0]?.path || null,
      transferCertificate:
        uploadedFiles?.transferCertificate?.[0]?.path || null,
      studentDateOfBirthCertificate:
        uploadedFiles?.studentDateOfBirthCertificate?.[0]?.path || null,
    };

    // Merge form fields and file locations
    const registerStudentData = { ...formFields, ...fileLocations };

    // Create student entry in database
    const registerStudent = await prisma.registration.create({
      data: registerStudentData,
    });

    return res.status(201).json({ success: true, data: registerStudent });
  } catch (error) {
    console.error("Error in Student Registration!", error);
    return res
      .status(500)
      .json({ success: false, data: "It's not you, it's us!" });
  }
};

export default registerStudent;
