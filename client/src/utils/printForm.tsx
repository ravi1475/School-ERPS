export const handlePrintForm = (formData) => {
    try {
      // School logo placeholder - replace with your actual logo URL if available
      const schoolLogoPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ESchool Logo%3C/text%3E%3C/svg%3E";
  
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
  
      const printContent = `
        <div class="form-container">
          <div class="form-header">
            <div class="logo">
              <img src="${schoolLogoPlaceholder}" alt="School Logo" />
            </div>
            <div class="header-text">
              <h1>Student Registration Form</h1>
              <p class="school-name">Your School Name</p>
              <p class="school-address">School Address, City, State, PIN: 123456</p>
            </div>
            <div class="form-details">
              <table class="details-table">
                <tr>
                  <td class="label">Form No:</td>
                  <td class="value highlight">${formData.formNo}</td>
                </tr>
                <tr>
                  <td class="label">Date:</td>
                  <td class="value">${formData.regnDate || today}</td>
                </tr>
                <tr>
                  <td class="label">Academic Year:</td>
                  <td class="value">2025-26</td>
                </tr>
              </table>
            </div>
          </div>
  
          <div class="form-section">
            <h2>Program Details</h2>
            <table class="info-table">
              <tr>
                <td class="label" width="30%">Registering for Class</td>
                <td class="value highlight" width="20%">${formData.registerForClass}</td>
                <td class="label" width="30%">Admission Category</td>
                <td class="value" width="20%">${formData.admissionCategory}</td>
              </tr>
              <tr>
                <td class="label">Test Date</td>
                <td class="value">${formData.testDate || 'N/A'}</td>
                <td class="label">Exam Subject</td>
                <td class="value">${formData.examSubject || 'N/A'}</td>
              </tr>
            </table>
          </div>
  
          <div class="form-section">
            <h2>Student Personal Details</h2>
            <div class="personal-details">
              <table class="info-table">
                <tr>
                  <td class="label" width="25%">Student Full Name</td>
                  <td class="value highlight" width="45%">${formData.firstName} ${formData.lastName}</td>
                  <td class="photo-placeholder" rowspan="4" width="30%">
                    <div class="photo-box">
                      <p>Affix Recent<br>Passport Size<br>Photograph</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="label">Date of Birth</td>
                  <td class="value">${formData.dob}</td>
                </tr>
                <tr>
                  <td class="label">Gender</td>
                  <td class="value">${formData.gender}</td>
                </tr>
                <tr>
                  <td class="label">Blood Group</td>
                  <td class="value">${formData.bloodGroup || 'N/A'}</td>
                </tr>
              </table>
  
              <table class="info-table">
                <tr>
                  <td class="label" width="25%">Category</td>
                  <td class="value" width="25%">${formData.category}</td>
                  <td class="label" width="25%">Religion</td>
                  <td class="value" width="25%">${formData.religion}</td>
                </tr>
                <tr>
                  <td class="label">Aadhar Card No.</td>
                  <td class="value">${formData.studentAadharCardNo}</td>
                  <td class="label">Single Parent</td>
                  <td class="value">${formData.singleParent ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td class="label">Email Address</td>
                  <td class="value" colspan="3">${formData.studentEmail}</td>
                </tr>
                <tr>
                  <td class="label">Contact Number</td>
                  <td class="value">${formData.contactNo}</td>
                  <td class="label"></td>
                  <td class="value"></td>
                </tr>
              </table>
            </div>
          </div>
  
          <div class="form-section">
            <h2>Address Details</h2>
            <table class="info-table">
              <tr>
                <td class="label" width="25%">Full Address</td>
                <td class="value" colspan="3">${formData.address}</td>
              </tr>
              <tr>
                <td class="label">City</td>
                <td class="value" width="25%">${formData.city}</td>
                <td class="label" width="25%">State</td>
                <td class="value" width="25%">${formData.state}</td>
              </tr>
              <tr>
                <td class="label">Pincode</td>
                <td class="value">${formData.pincode}</td>
                <td class="label"></td>
                <td class="value"></td>
              </tr>
            </table>
          </div>
  
          <div class="form-section">
            <h2>Parent's Details</h2>
            
            <div class="parent-section">
              <h3>Father's Details</h3>
              <table class="info-table">
                <tr>
                  <td class="label" width="25%">Name</td>
                  <td class="value" width="25%">${formData.fatherName}</td>
                  <td class="label" width="25%">Mobile Number</td>
                  <td class="value" width="25%">${formData.fatherMobileNo}</td>
                </tr>
                <tr>
                  <td class="label">Email Address</td>
                  <td class="value">${formData.fatherEmail || 'N/A'}</td>
                  <td class="label">Aadhar Card No.</td>
                  <td class="value">${formData.fatherAadharCardNo}</td>
                </tr>
                <tr>
                  <td class="label">SMS Alerts</td>
                  <td class="value">${formData.smsAlert ? 'Enabled' : 'Disabled'}</td>
                  <td class="label">Campus Employee</td>
                  <td class="value">${formData.isFatherCampusEmployee ? 'Yes' : 'No'}</td>
                </tr>
              </table>
            </div>
            
            <div class="parent-section">
              <h3>Mother's Details</h3>
              <table class="info-table">
                <tr>
                  <td class="label" width="25%">Name</td>
                  <td class="value" width="25%">${formData.motherName}</td>
                  <td class="label" width="25%">Mobile Number</td>
                  <td class="value" width="25%">${formData.motherMobileNo}</td>
                </tr>
                <tr>
                  <td class="label">Aadhar Card No.</td>
                  <td class="value">${formData.motherAadharCardNo}</td>
                  <td class="label"></td>
                  <td class="value"></td>
                </tr>
              </table>
            </div>
          </div>
  
          <div class="form-section">
            <h2>Payment Details</h2>
            <table class="info-table">
              <tr>
                <td class="label" width="25%">Registration Fee</td>
                <td class="value" width="25%">₹${formData.regnCharge}</td>
                <td class="label" width="25%">Transaction No.</td>
                <td class="value" width="25%">${formData.transactionNo}</td>
              </tr>
              <tr>
                <td class="label">Payment Status</td>
                <td class="value highlight-${formData.paymentStatus === 'Completed' ? 'success' : 'warning'}">${formData.paymentStatus}</td>
                <td class="label"></td>
                <td class="value"></td>
              </tr>
            </table>
          </div>
  
          <div class="form-section">
            <h2>Document Checklist</h2>
            <table class="info-table checklist-table">
              <tr>
                <th width="5%">S.No</th>
                <th width="65%">Document Description</th>
                <th width="30%">Status</th>
              </tr>
              <tr>
                <td class="center">1</td>
                <td>Student Aadhar Card</td>
                <td class="center status-${formData.studentAadharCard ? 'submitted' : 'pending'}">${formData.studentAadharCard ? 'Submitted' : 'Pending'}</td>
              </tr>
              <tr>
                <td class="center">2</td>
                <td>Father's Aadhar Card</td>
                <td class="center status-${formData.fatherAadharCard ? 'submitted' : 'pending'}">${formData.fatherAadharCard ? 'Submitted' : 'Pending'}</td>
              </tr>
              <tr>
                <td class="center">3</td>
                <td>Mother's Aadhar Card</td>
                <td class="center status-${formData.motherAadharCard ? 'submitted' : 'pending'}">${formData.motherAadharCard ? 'Submitted' : 'Pending'}</td>
              </tr>
              <tr>
                <td class="center">4</td>
                <td>Previous Class Marksheet</td>
                <td class="center status-${formData.previousClassMarksheet ? 'submitted' : 'pending'}">${formData.previousClassMarksheet ? 'Submitted' : 'Pending'}</td>
              </tr>
              <tr>
                <td class="center">5</td>
                <td>Transfer Certificate</td>
                <td class="center status-${formData.transferCertificate ? 'submitted' : 'pending'}">${formData.transferCertificate ? 'Submitted' : 'Pending'}</td>
              </tr>
              <tr>
                <td class="center">6</td>
                <td>Birth Certificate</td>
                <td class="center status-${formData.studentDateOfBirthCertificate ? 'submitted' : 'pending'}">${formData.studentDateOfBirthCertificate ? 'Submitted' : 'Pending'}</td>
              </tr>
              <tr>
                <td class="center">7</td>
                <td>Caste Certificate (if applicable)</td>
                <td class="center status-${formData.casteCertificate ? 'submitted' : 'pending'}">${formData.casteCertificate ? 'Submitted' : 'Pending'}</td>
              </tr>
            </table>
          </div>
  
          <div class="form-footer">
            <div class="signature-section">
              <div class="signature-box">
                <p>Signature of Student</p>
              </div>
              <div class="signature-box">
                <p>Signature of Parent/Guardian</p>
              </div>
              <div class="signature-box">
                <p>For Office Use Only</p>
              </div>
            </div>
            <div class="footer-note">
              <p>Note: This is a computer-generated form and does not require a signature for validity.</p>
              <p>Form generated on: ${today}</p>
            </div>
          </div>
        </div>
      `;
  
      // Open a new window and print the student details
      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Failed to open print window");
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Registration Form - ${formData.firstName} ${formData.lastName}</title>
            <style>
              @page {
                size: A4;
                margin: 1cm;
              }
              body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                color: #333;
                line-height: 1.5;
                margin: 0;
                padding: 0;
                font-size: 12px;
              }
              .form-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 0;
                box-sizing: border-box;
              }
              .form-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              .logo {
                width: 100px;
              }
              .logo img {
                width: 100%;
                height: auto;
              }
              .header-text {
                text-align: center;
                flex-grow: 1;
              }
              h1 {
                color: #1e40af;
                margin: 0 0 5px 0;
                font-size: 20px;
              }
              .school-name {
                font-weight: bold;
                margin: 0 0 3px 0;
                font-size: 16px;
              }
              .school-address {
                margin: 0;
                font-size: 11px;
                color: #666;
              }
              .form-details {
                width: 150px;
              }
              .details-table {
                border-collapse: collapse;
                width: 100%;
              }
              .details-table td {
                padding: 3px;
                vertical-align: top;
                border: 1px solid #ddd;
                font-size: 10px;
              }
              .form-section {
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 1px solid #eee;
              }
              h2 {
                color: #1e40af;
                font-size: 14px;
                margin: 0 0 8px 0;
                padding: 4px 8px;
                background-color: #f0f4ff;
                border-left: 4px solid #1e40af;
              }
              h3 {
                font-size: 12px;
                margin: 10px 0 5px 0;
                color: #4b5563;
                border-bottom: 1px dashed #ddd;
                padding-bottom: 3px;
              }
              .info-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              .info-table th,
              .info-table td {
                border: 1px solid #ddd;
                padding: 6px 8px;
                vertical-align: top;
              }
              .info-table th {
                background-color: #f9fafb;
                font-weight: bold;
                text-align: left;
              }
              .label {
                font-weight: bold;
                background-color: #f9fafb;
                width: 25%;
              }
              .value {
                width: 25%;
              }
              .highlight {
                font-weight: bold;
                color: #1e40af;
              }
              .highlight-success {
                font-weight: bold;
                color: #047857;
              }
              .highlight-warning {
                font-weight: bold;
                color: #ca8a04;
              }
              .photo-placeholder {
                vertical-align: middle;
                text-align: center;
              }
              .photo-box {
                border: 1px dashed #999;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
              }
              .photo-box p {
                color: #777;
                font-size: 11px;
                line-height: 1.5;
              }
              .center {
                text-align: center;
              }
              .checklist-table {
                margin-top: 5px;
              }
              .status-submitted {
                font-weight: bold;
                color: #047857;
              }
              .status-pending {
                font-weight: bold;
                color: #ca8a04;
              }
              .form-footer {
                margin-top: 20px;
              }
              .signature-section {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                margin-bottom: 20px;
              }
              .signature-box {
                width: 30%;
                border-top: 1px solid #999;
                padding-top: 5px;
                text-align: center;
              }
              .signature-box p {
                margin: 0;
                font-size: 10px;
              }
              .footer-note {
                text-align: center;
                font-size: 9px;
                color: #666;
                margin-top: 30px;
                border-top: 1px solid #eee;
                padding-top: 10px;
              }
              .parent-section {
                margin-bottom: 10px;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .form-container {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
  
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        // Uncomment below line to close window after printing
        // printWindow.close();
      }, 500);
    } catch (error) {
      console.error("Error printing student info:", error);
      alert("Failed to print student information.");
    }
  };