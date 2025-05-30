import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FeeStructure from './pages/FeeStructure';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import StudentRegistrationForm from './pages/StudentForm';
import AuthPage from './pages/AuthPage';
import AccountsPage from './pages/AccountsPage';
import UserManagement from './pages/UserManagement';
import UserEdit from './pages/UserEdit';
import LoginForm from './pages/LoginForm';
import CreateExam from './components/Teacher/Exam'
// import TCFrom from './components/Schools/TCFrom' 
import TCList from './components/Schools/TCForm/TCList' 

// import { ClassSectionManagement } from './components/Admin/Class'
// import { ManageTeachers } from './pages/ManageTeachers'
import { ManageStudent } from './pages/ManageStudents'
// import  StudentFeeDetails  from './components/StudentFeeDetails'
import TeacherProfile from './components/Teacher/TeacherProfile'
import SchoolProfile from './components/Schools/SchoolProfile'

import ManageSchools from './components/Admin/ManageSchools';
import ManageUsers from './components/Admin/ManageUser';
import StaffDirectory from './components/Admin/StaffDirectory';
import StaffDocumentManagement from "./components/Admin/StaffDocumentManagement";
import SchoolReports from "./components/Schools/Reports";
import SchoolCalendar from "./components/Schools/Calender";
import BudgetPlanning from "./components/Schools/BudgetPlanning";
import ExpenseTracker from "./components/Schools/ExpenseTracker";
import AccreditationComponent from "./components/Schools/Accreditation";
import DepartmentManagement from "./components/Schools/DepartmentManagement";
import ReportsDashboard from "./components/Admin/MainReports";
import ClassAssignmentManager from "./components/Schools/Assignment";
import TeacherEvaluationPage from "./components/Schools/TeacherEvaluation";
import ClassManagement from "./components/Teacher/classManagement";
import TeachingMaterials from "./components/Teacher/TeachingMaterials";
import AssignmentManager from './components/Teacher/Assignment';
import TeacherDirectory from './components/Schools/TeacherDirectory/TeacherDirectory';
import ExamSchedule from './components/Teacher/ExamSchedule';
import FeeCollectionApp from "./components/Schools/FeesCollection";
import  AttendanceManagement from "./components/Teacher/AttendanceManagement";
import CheckBounceSystem from "./components/Schools/ChequeBounce";
import GradeManagementSchool from "./components/Schools/ExamGrade";
import BusTracking from "./components/Schools/Bustracking";
import StudentRegistration from "./pages/StudentRegister";
import RegisterStudentsData from "./pages/RegisterStudentsData";
import AdminNavbar from "./components/Admin/AdminNavbar";
import AdminDashboard from "./components/Admin/AdminDashboard";
// Uncomment these when the components are availableF
// import StudentFeeDetails from './pages/StudentFeeDetails';
// import PaymentGateway from './pages/PaymentGateway';
// import UserProfile from './pages/UserProfile';
// import NotFound from './pages/NotFound';

// Loader for all pages

import { Toaster } from 'react-hot-toast';

// PathTracker component to save current path in sessionStorage
const PathTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Don't track auth and login pages
    if (location.pathname !== '/auth' && location.pathname !== '/login' && location.pathname !== '/') {
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [location]);
  
  return null;
};

// The main App component that provides authentication state
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (token: string, role: string = 'user') => {
    // Store auth info in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);

    // Update state
    setToken(token);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear auth info from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("loginTimestamp");
    
    // Clear any session storage
    sessionStorage.clear();
    
    // Clear any auth cookies if present
    document.cookie = 'authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Reset state
    setToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
    
    console.log("Logout successful");
  };

  // The main App component that provides authentication state
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AppContent 
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          handleAuthSuccess={handleAuthSuccess}
          handleLogout={handleLogout}
        />
      </Router>
    </>
  );
}

// Component to handle routing with path tracking
function AppContent({
  isAuthenticated,
  userRole,
  handleAuthSuccess,
  handleLogout
}: {
  isAuthenticated: boolean;
  userRole: string | null;
  handleAuthSuccess: (token: string, role: string) => void;
  handleLogout: () => void;
}) {
  // Protected route component
  const ProtectedRoute = ({
    children,
    allowedRoles = ['admin', 'school', 'teacher', 'user']
  }: {
    children: JSX.Element,
    allowedRoles?: string[]
  }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }

    if (userRole && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <>
      <PathTracker />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ?
              <Navigate to={sessionStorage.getItem('lastPath') || "/dashboard"} replace /> :
              <LoginForm onLoginSuccess={handleAuthSuccess} />
          }
        />

        <Route
          path="/auth"
          element={
            isAuthenticated ?
              <Navigate to={sessionStorage.getItem('lastPath') || "/dashboard"} replace /> :
              <AuthPage onAuthSuccess={handleAuthSuccess} />
          }
        />

        {/* Default route - redirect to login if not authenticated, dashboard if authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" replace /> :
              <Navigate to="/auth" replace />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/school/students/financial-management/student-management"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/school/financial-management/fee-structure"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <FeeStructure />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/Attendence"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/students/tc-form"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <TCList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/school/reports"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/school/financial-management/account-page"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <AccountsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/faculty-management/teacher-directory"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <TeacherDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/school/profile"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <SchoolProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
      

        <Route
          path="/school/BusTracking"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <BusTracking />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/StudentRegistrationForm"
          element={
            <ProtectedRoute allowedRoles={['admin', 'school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentRegistrationForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/myclasses/assignment"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <AssignmentManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/examination/create-exam"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <CreateExam />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <TeacherProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students/Attendance"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <AttendanceManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/examination/exam-schedule"
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <ExamSchedule />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/School/BudgetPlanning"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                < BudgetPlanning />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/School/FeeCollection"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                < FeeCollectionApp/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/School/ExpenseTracker"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                < ExpenseTracker />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/School/Accreditation"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                < AccreditationComponent />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/School/CheckBounceSystem"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <CheckBounceSystem />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/students/register/addNew"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentRegistration />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/students/register/allStudents"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <RegisterStudentsData />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/administration/departments"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <DepartmentManagement/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/GradeManagementSchool"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <GradeManagementSchool/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/manage"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <ClassManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/TeachingMaterials"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <TeachingMaterials />
              </Layout>
            </ProtectedRoute>
          }
        />



        < Route
          path='/master/class-section'
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <ManageStudent />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path='/school/students/manage-students'
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <ManageStudent />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* <Route
            path='/school/administration/manage-teachers'
            element={
              <ProtectedRoute>
                <Layout userRole={userRole} onLogout={handleLogout}>
                  <ManageTeachers />
                </Layout>
              </ProtectedRoute>
            } > </Route> */}


        <Route
          path="/Calender"
          element={
            <ProtectedRoute allowedRoles={['admin', 'school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <SchoolCalendar />
              </Layout>
            </ProtectedRoute>
          }

        />

        {/* Uncomment these routes when the components are available */}
        {/* 
        <Route 
          path="/student-fee/:id" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <StudentFeeDetails />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/payment/:studentId" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <PaymentGateway />
              </Layout>
            </ProtectedRoute>
          } 
        />
        */}


        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/schools"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <ManageSchools />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <ManageUsers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <StaffDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/documents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <StaffDocumentManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Report-admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <ReportsDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/School/report"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <SchoolReports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/School/ClassAssignment"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <ClassAssignmentManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/School/TeacherEvaluationPage"
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <Layout onLogout={handleLogout} userRole={userRole}>
                <TeacherEvaluationPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* User Management Routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        



        {/* Uncomment these routes when the components are available */}
        {/*
        <Route 
          path="/users/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'school']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        */}

        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile route - accessible by all authenticated users */}
        {/*
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout userRole={userRole} onLogout={handleLogout}>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          } 
        />
        */}

        {/* Unauthorized access page */}
        <Route
          path="/unauthorized"
          element={
            <Layout userRole={userRole} onLogout={handleLogout}>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="mb-4">You don't have permission to access this resource.</p>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go Back
                </button>
              </div>
            </Layout>
          }
        />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Layout userRole={userRole} onLogout={handleLogout}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
                  <p className="mb-4">The page you are looking for does not exist.</p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go Back
                  </button>
                </div>
              </Layout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;