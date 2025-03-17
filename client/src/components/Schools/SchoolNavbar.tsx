import React from "react";
import { Link } from "react-router-dom";
import { 
  School, 
  Settings, 
  LogOut, 
  FileText, 
  User, 
  Home, 
  Calendar, 
  Users, 
  Database, 
  BarChart2,
  HelpCircle,
  DollarSign,
  Book,
  Award,
  Briefcase,
  Bell
} from "lucide-react";

interface SchoolNavbarProps {
  activeDropdown: string | null;
  toggleDropdown: (menu: string) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  onLogout?: () => void;
  isProfileDropdownOpen: boolean;
  setIsProfileDropdownOpen: (isOpen: boolean) => void;
  profileDropdownRef: React.RefObject<HTMLDivElement>;
}

interface NavDropdownProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface NavLinkProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
}

// Navigation dropdown component
const NavDropdown: React.FC<NavDropdownProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onClick, 
  children 
}) => {
  return (
    <li className="relative">
      <button
        onClick={onClick}
        className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between rounded-md transition-colors duration-200
          ${isOpen 
            ? "text-blue-700 bg-blue-50" 
            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          }`}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <span>{title}</span>
        </div>
        <svg 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className="pl-4 pr-2 py-2 space-y-1">
          {children}
        </div>
      )}
    </li>
  );
};

// Navigation link component
const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, onClick, badge }) => {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && <span className="mr-3 flex-shrink-0">{icon}</span>}
        <span className="font-medium">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

// Update the handleSignOutClick function in ProfileDropdown
const ProfileDropdown = ({ onLogout }: { onLogout?: () => void }) => {
  const handleSignOutClick = () => {
    if (onLogout) {
      onLogout(); // This will call the handleLogout function from App.tsx
    } else {
      // Fallback if onLogout prop is not available
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('loginTimestamp');
      
      sessionStorage.clear();
      
      document.cookie = 'authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      window.location.href = '/login';
    }
  };
  
  return (
    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="text-sm font-medium text-gray-900 truncate">principal@school.edu</p>
        <div className="mt-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            School Admin
          </span>
        </div>
      </div>

      <Link
        to="/school/profile"
        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
      >
        <div className="flex items-center">
          <User className="h-4 w-4 mr-3 text-blue-600" />
          School Profile
        </div>
      </Link>
      
      <Link
        to="/school/settings"
        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
      >
        <div className="flex items-center">
          <Settings className="h-4 w-4 mr-3 text-blue-600" />
          School Settings
        </div>
      </Link>
      
      <Link
        to="/school/notifications"
        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
      >
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-3 text-blue-600" />
          Notification Settings
        </div>
      </Link>
      
      <button
        onClick={handleSignOutClick}
        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
      >
        <div className="flex items-center">
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </div>
      </button>
    </div>
  );
};

const SchoolNavbar = {
  renderSidebar: (props: SchoolNavbarProps) => {
    const { activeDropdown, toggleDropdown, setIsMobileSidebarOpen } = props;
    
    return (
      <div className="flex-1 overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 px-3 space-y-1.5">
          {/* School Dashboard */}
          <NavLink 
            to="/dashboard" 
            icon={<Home className="h-5 w-5 text-blue-600" />} 
            label="School Dashboard" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Administration */}
          <NavDropdown 
            title="Administration" 
            icon={<Briefcase className="h-5 w-5 text-blue-600" />}
            isOpen={activeDropdown === "administration"} 
            onClick={() => toggleDropdown("administration")}
          >
            {/* <NavLink 
              to="/school/administration/manage-teachers" 
              label="Manage Teachers" 
              onClick={() => {
                if (window.innerWidth < 768) { // Check for mobile view
                  setIsMobileSidebarOpen(false);
                }
              }}
            /> */}
            <NavLink 
              to="/school/administration/departments" 
              label="Departments" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            
          </NavDropdown>

          {/* Academic Programs
          <NavDropdown 
            title="Academic Programs" 
            icon={<Book className="h-5 w-5 text-purple-600" />}
            isOpen={activeDropdown === "academics"} 
            onClick={() => toggleDropdown("academics")}
          >
            <NavLink 
              to="/school/academics/programs" 
              label="Program Overview" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/academics/curriculum" 
              label="Curriculum Management" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/academics/classes" 
              label="Class Structure" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          </NavDropdown> */}

          {/* Student Management */}
          <NavDropdown 
            title="Student Management" 
            icon={<Users className="h-5 w-5 text-green-600" />}
            isOpen={activeDropdown === "students"} 
            onClick={() => toggleDropdown("students")}
          >
            <NavLink 
              to="/students/StudentRegistrationForm" 
              label="Admissions" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/students/manage-students" 
              label="Manage Students" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/students/enrollment" 
              label="Enrollment" 
              badge={24}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/students/records" 
              label="Student Records" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          </NavDropdown>

          {/* Faculty Management */}
          <NavDropdown 
            title="Faculty Management" 
            icon={<Users className="h-5 w-5 text-orange-600" />}
            isOpen={activeDropdown === "faculty"} 
            onClick={() => toggleDropdown("faculty")}
          >
            <NavLink 
              to="/school/faculty-management/teacher-directory" 
              label="Teacher Directory" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/BusTracking" 
              label="Bus tracking" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/School/ClassAssignment" 
              label="Class Assignments" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/School/TeacherEvaluationPage" 
              label="Teacher Evaluations" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          </NavDropdown>

          {/* Financial Management */}
          <NavDropdown 
            title="Financial Management" 
            icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
            isOpen={activeDropdown === "finance"} 
            onClick={() => toggleDropdown("finance")}
          >
            <NavLink 
              to="/school/financial-management/account-page" 
              label="Accounts Management" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/School/FeeCollection" 
              label="Fees Collection" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/School/CheckBounceSystem" 
              label="Check Bounce " 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/School/BudgetPlanning" 
              label="Budget Planning" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/financial-management/fee-structure" 
              label="Fee Structure" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/School/ExpenseTracker" 
              label="Expense Tracking" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <NavLink 
              to="/school/students/financial-management/student-management" 
              label="Dues & Payments" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          </NavDropdown>

         

          {/* School Calendar */}
          <NavLink 
            to="/school/GradeManagementSchool" 
            icon={<Book className="h-5 w-5 text-indigo-600" />} 
            label="Exams & Grade Management" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <NavLink 
            to="/Calender" 
            icon={<Calendar className="h-5 w-5 text-indigo-600" />} 
            label="School Calendar" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Analytics & Reports */}
          <NavLink 
            to="/School/report" 
            icon={<BarChart2 className="h-5 w-5 text-yellow-600" />} 
            label="Analytics & Reports" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Accreditation */}
          <NavLink 
            to="/School/Accreditation" 
            icon={<Award className="h-5 w-5 text-pink-600" />} 
            label="Accreditation" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Help & Support */}
          <NavLink 
            to="/school/help" 
            icon={<HelpCircle className="h-5 w-5 text-gray-600" />} 
            label="Help & Support" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        </nav>
      </div>
    );
  },

  ProfileDropdown,

  renderHeader: () => (
    <div className="flex items-center">
      <div className="bg-blue-50 p-1.5 rounded-md">
        <School className="h-8 w-8 text-blue-600" />
      </div>
      <span className="ml-2.5 text-xl font-bold text-gray-900 hidden md:block">
        School Admin Portal
      </span>
    </div>
  ),

  renderProfileButton: (props: SchoolNavbarProps) => {
    const { isProfileDropdownOpen, setIsProfileDropdownOpen, profileDropdownRef, onLogout } = props;
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };
    
    return (
      <div className="ml-3 relative" ref={profileDropdownRef}>
        <button
          onClick={handleClick}
          aria-label="Toggle profile dropdown"
          className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-blue-300"
        >
          <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
            <User className="h-6 w-6" />
          </div>
        </button>
        
        {isProfileDropdownOpen && <ProfileDropdown onLogout={onLogout} />}
      </div>
    );
  }
};

export default SchoolNavbar;