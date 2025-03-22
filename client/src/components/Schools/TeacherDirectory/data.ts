export const AVAILABLE_CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F']
export const MOCK_TEACHERS = [
  {
    id: 1,
    name: 'Mr. Robert Chen',
    email: 'robert.chen@greenfield.edu',
    phone: '+91 9876543003',
    designation: 'Mathematics Teacher',
    subjects: ['Mathematics', 'Calculus'],
    classes: '4, 5, 6',
    sections: [
      { class: '4', sections: ['A', 'B'] },
      { class: '5', sections: ['A', 'C'] },
      { class: '6', sections: ['B'] },
    ],
    joinDate: '2020-07-05',
    address: '78 Green Street, Knowledge City',
    education: 'M.Sc. in Mathematics',
    experience: '8 years',
    profileImage: 'https://randomuser.me/api/portraits/men/64.jpg',
    isClassIncharge: true,
    inchargeClass: '4',
    inchargeSection: 'A',
  },
  // Add other teachers here...
];