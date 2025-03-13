// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// // Improved error handling middleware
// const handleError = (res, error, context) => {
//   console.error(`Error ${context}:`, error);
//   return res.status(500).json({
//     success: false,
//     message: `Failed to ${context}`,
//     error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//   });
// };

// /**
//  * Get unique classes from students
//  * @route GET /api/attendance/classes
//  */
// export const getClasses = async (req, res) => {
//   try {
//     const classes = await prisma.student.groupBy({
//       by: ['className', 'section'],
//       where: {
//         className: { not: null },
//         section: { not: null }
//       },
//       orderBy: [
//         { className: 'asc' },
//         { section: 'asc' }
//       ],
//     });

//     if (!classes || classes.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No classes found'
//       });
//     }

//     // Format classes for frontend
//     const formattedClasses = classes.map(cls => ({
//       id: `${cls.className}-${cls.section}`,
//       name: `Class ${cls.className} - Section ${cls.section}`,
//       className: cls.className,
//       section: cls.section
//     }));

//     return res.status(200).json({
//       success: true,
//       classes: formattedClasses
//     });

//   } catch (error) {
//     return handleError(res, error, 'fetch classes');
//   }
// };

// /**
//  * Get students for attendance with validation
//  * @route GET /api/attendance/students
//  */
// export const getStudentsForAttendance = async (req, res) => {
//   try {
//     const { className, section } = req.query;

//     // Validate input parameters
//     if (!className || !section) {
//       return res.status(400).json({
//         success: false,
//         message: 'Both class name and section are required'
//       });
//     }

//     const students = await prisma.student.findMany({
//       where: {
//         className: className,
//         section: section,
//         isActive: true // Add active student filter
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         rollNumber: true,
//         className: true,
//         section: true,
//         admissionNo: true
//       },
//       orderBy: [
//         { rollNumber: 'asc' }
//       ],
//     });

//     if (!students || students.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No students found for this class and section'
//       });
//     }

//     // Format students with full name
//     const formattedStudents = students.map(student => ({
//       id: student.id,
//       name: `${student.firstName} ${student.lastName}`.trim(),
//       rollNo: student.rollNumber || 'N/A',
//       class: student.className,
//       section: student.section,
//       admissionNo: student.admissionNo
//     }));

//     return res.status(200).json({
//       success: true,
//       students: formattedStudents
//     });

//   } catch (error) {
//     return handleError(res, error, 'fetch students');
//   }
// };

// /**
//  * Record attendance with validation
//  * @route POST /api/attendance
//  */
// export const recordAttendance = async (req, res) => {
//   try {
//     const { date, attendanceRecords, notes } = req.body;

//     // Basic validation
//     if (!date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid request format'
//       });
//     }

//     const transactionResults = await prisma.$transaction(
//       attendanceRecords.map(record => 
//         prisma.attendance.upsert({
//           where: {
//             studentId_date: {
//               studentId: record.studentId,
//               date: new Date(date)
//             }
//           },
//           update: {
//             status: record.status,
//             notes: notes || null,
//             recordedBy: req.user?.id || 1
//           },
//           create: {
//             studentId: record.studentId,
//             date: new Date(date),
//             status: record.status,
//             notes: notes || null,
//             recordedBy: req.user?.id || 1,
//             teacherId: req.user?.id || 1
//           }
//         })
//       )
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Attendance recorded successfully',
//       records: transactionResults
//     });

//   } catch (error) {
//     return handleError(res, error, 'record attendance');
//   }
// };

// /**
//  * Get attendance records with filters
//  * @route GET /api/attendance
//  */
// export const getAttendanceRecords = async (req, res) => {
//   try {
//     const { date, className, section, studentId } = req.query;

//     const records = await prisma.attendance.findMany({
//       where: {
//         date: date ? new Date(date) : undefined,
//         student: {
//           className: className || undefined,
//           section: section || undefined,
//           id: studentId ? parseInt(studentId) : undefined
//         }
//       },
//       include: {
//         student: {
//           select: {
//             firstName: true,
//             lastName: true,
//             rollNumber: true,
//             className: true,
//             section: true
//           }
//         }
//       },
//       orderBy: {
//         date: 'desc'
//       }
//     });

//     // Format response for frontend
//     const formattedRecords = records.map(record => ({
//       id: record.id,
//       date: record.date.toISOString().split('T')[0],
//       status: record.status,
//       notes: record.notes,
//       studentId: record.studentId,
//       studentName: `${record.student.firstName} ${record.student.lastName}`,
//       rollNo: record.student.rollNumber,
//       class: record.student.className,
//       section: record.student.section
//     }));

//     return res.status(200).json({
//       success: true,
//       records: formattedRecords
//     });

//   } catch (error) {
//     return handleError(res, error, 'fetch attendance records');
//   }
// };