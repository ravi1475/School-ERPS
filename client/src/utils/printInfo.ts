export const handlePrintInfo = (formData) => {
  try {
    // Ensure formNo is available
    if (!formData.formNo) {
      alert("Please enter a valid Form Number.");
      return;
    }

    const student = formData;

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Information</title>
        <style>
          body {
            font-family: sans-serif;
            line-height: 1.4;
            padding: 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 20px;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          h3 {
            margin-top: 15px;
            margin-bottom: 10px;
            color: #555;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-row > div {
            flex: 1;
            padding-right: 15px;
          }
          .info-row > div:last-child {
            padding-right: 0;
          }
          .label {
            font-weight: bold;
            margin-right: 5px;
            color: #555;
            display: block;
            margin-bottom: 3px;
          }
          .value {
            color: #333;
          }
          .address {
            white-space: pre-line;
          }
          .single-parent {
            font-style: italic;
            color: #777;
          }
          .sms-alert-enabled {
            color: green;
            font-weight: bold;
          }
          .sms-alert-disabled {
            color: red;
          }
          .campus-employee-yes {
            color: green;
            font-weight: bold;
          }
          .campus-employee-no {
            color: red;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Student Information</h2>

          <h3>Student Details</h3>
          <div class="info-row">
            <div><span class="label">First Name:</span> <span class="value">${student.firstName}</span></div>
            <div><span class="label">Last Name:</span> <span class="value">${student.lastName}</span></div>
            <div><span class="label">Gender:</span> <span class="value">${student.gender}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Form No:</span> <span class="value">${student.formNo}</span></div>
            <div><span class="label">Date of Birth:</span> <span class="value">${student.dob}</span></div>
            <div><span class="label">Category:</span> <span class="value">${student.category}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Religion:</span> <span class="value">${student.religion}</span></div>
            <div><span class="label">Registering for Class:</span> <span class="value">${student.registerForClass}</span></div>
            <div><span class="label">Admission Category:</span> <span class="value">${student.admissionCategory}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Blood Group:</span> <span class="value">${student.bloodGroup}</span></div>
            <div><span class="label">Registration Date:</span> <span class="value">${student.regnDate}</span></div>
            <div><span class="label">Test Date:</span> <span class="value">${student.testDate}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Transaction No:</span> <span class="value">${student.transactionNo}</span></div>
            <div><span class="label">Single Parent:</span> <span class="value">${student.singleParent ? '<span class="single-parent">Yes</span>' : 'No'}</span></div>
            <div><span class="label">Contact No:</span> <span class="value">${student.contactNo}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Email:</span> <span class="value">${student.studentEmail}</span></div>
            <div style="flex: 2;"><span class="label">Address:</span> <span class="value address">${student.address}, ${student.city}, ${student.state} - ${student.pincode}</span></div>
            <div></div>
          </div>
          <div class="info-row">
            <div><span class="label">Student Aadhar Card No:</span> <span class="value">${student.studentAadharCardNo}</span></div>
            <div><span class="label">Registration Charge:</span> <span class="value">${student.regnCharge}</span></div>
            <div><span class="label">Exam Subject:</span> <span class="value">${student.examSubject}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Payment Status:</span> <span class="value">${student.paymentStatus}</span></div>
            <div></div>
            <div></div>
          </div>

          <h3>Father's Information</h3>
          <div class="info-row">
            <div><span class="label">Father's Name:</span> <span class="value">${student.fatherName}</span></div>
            <div><span class="label">Father's Mobile No:</span> <span class="value">${student.fatherMobileNo}</span></div>
            <div><span class="label">SMS Alert:</span> <span class="value">${student.smsAlert ? '<span class="sms-alert-enabled">Enabled</span>' : '<span class="sms-alert-disabled">Disabled</span>'}</span></div>
          </div>
          <div class="info-row">
            <div><span class="label">Father's Email:</span> <span class="value">${student.fatherEmail}</span></div>
            <div><span class="label">Father's Aadhar Card No:</span> <span class="value">${student.fatherAadharCardNo}</span></div>
            <div><span class="label">Is Father Campus Employee:</span> <span class="value">${student.isFatherCampusEmployee ? '<span class="campus-employee-yes">Yes</span>' : '<span class="campus-employee-no">No</span>'}</span></div>
          </div>

          <h3>Mother's Information</h3>
          <div class="info-row">
            <div><span class="label">Mother's Name:</span> <span class="value">${student.motherName}</span></div>
            <div><span class="label">Mother's Mobile No:</span> <span class="value">${student.motherMobileNo}</span></div>
            <div><span class="label">Mother's Aadhar Card No:</span> <span class="value">${student.motherAadharCardNo}</span></div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  } catch (error) {
    console.error("Error printing student info:", error);
    alert("Failed to print student information.");
  }
};