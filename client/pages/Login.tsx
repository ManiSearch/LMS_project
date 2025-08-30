import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SessionManager } from "@/utils/sessionManager";
// import { DebugLogin } from "@/components/DebugLogin";
import { InstitutionService, useInstitutions } from "@/services/institutionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstitutionComboBox } from "@/components/ui/institution-combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  School,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Shield,
  Sparkles,
  Lock,
  User,
  Mail,
  Moon,
  Sun,
  CheckCircle,
  Users,
  BookOpen,
  GraduationCap,
  Monitor,
  FileText,
  Award,
  Building,
  Library,
  ShoppingCart,
  Package,
  DollarSign,
  UserCheck,
  CreditCard,
  Building2,
  PenTool,
  FlaskConical,
  Settings,
} from "lucide-react";

const getModuleIcon = (moduleId: string) => {
  const iconMap: { [key: string]: any } = {
    "academic-operation": BookOpen,
    admission: Users,
    "student-support": GraduationCap,
    lms: Monitor,
    examination: FileText,
    "alumni-management": Award,
    hostel: Building,
    library: Library,
    procurement: ShoppingCart,
    "asset-management": Package,
    "finance-management": DollarSign,
    hrms: UserCheck,
    payroll: CreditCard,
    affiliation: Building2,
    gte: PenTool,
    research: FlaskConical,
    "master-setup": Settings,
  };
  return iconMap[moduleId] || BookOpen;
};

const getModuleFeatures = (moduleId: string) => {
  const featuresMap: {
    [key: string]: Array<{
      title: string;
      description: string;
      icon: any;
      color: string;
    }>;
  } = {
    "academic-operation": [
      {
        title: "Student Management",
        description: "Comprehensive student records",
        icon: Users,
        color: "bg-blue-500",
      },
      {
        title: "Curriculum Planning",
        description: "Course structure & syllabus",
        icon: BookOpen,
        color: "bg-green-500",
      },
      {
        title: "Attendance Tracking",
        description: "Real-time attendance monitoring",
        icon: UserCheck,
        color: "bg-purple-500",
      },
      {
        title: "Academic Reports",
        description: "Performance analytics",
        icon: FileText,
        color: "bg-orange-500",
      },
    ],
    lms: [
      {
        title: "Online Courses",
        description: "Interactive learning modules",
        icon: Monitor,
        color: "bg-blue-500",
      },
      {
        title: "Virtual Classrooms",
        description: "Live video sessions",
        icon: Users,
        color: "bg-green-500",
      },
      {
        title: "Assignments",
        description: "Submit & grade assignments",
        icon: FileText,
        color: "bg-purple-500",
      },
      {
        title: "Progress Tracking",
        description: "Learning analytics",
        icon: Award,
        color: "bg-orange-500",
      },
    ],
    examination: [
      {
        title: "Exam Planning",
        description: "Schedule & organize exams",
        icon: FileText,
        color: "bg-blue-500",
      },
      {
        title: "Question Banks",
        description: "Manage exam questions",
        icon: BookOpen,
        color: "bg-green-500",
      },
      {
        title: "Hall Tickets",
        description: "Generate admit cards",
        icon: Users,
        color: "bg-purple-500",
      },
      {
        title: "Result Processing",
        description: "Automated grading",
        icon: Award,
        color: "bg-orange-500",
      },
    ],
    admission: [
      {
        title: "Application Portal",
        description: "Online admission forms",
        icon: Users,
        color: "bg-blue-500",
      },
      {
        title: "Document Verification",
        description: "Digital document check",
        icon: Shield,
        color: "bg-green-500",
      },
      {
        title: "Merit Lists",
        description: "Automated ranking",
        icon: Award,
        color: "bg-purple-500",
      },
      {
        title: "Fee Management",
        description: "Payment processing",
        icon: DollarSign,
        color: "bg-orange-500",
      },
    ],
    "master-setup": [
      {
        title: "System Configuration",
        description: "Core system settings",
        icon: Settings,
        color: "bg-blue-500",
      },
      {
        title: "User Management",
        description: "Role & permission control",
        icon: Users,
        color: "bg-green-500",
      },
      {
        title: "Module Access",
        description: "Feature toggles",
        icon: Shield,
        color: "bg-purple-500",
      },
      {
        title: "Data Import/Export",
        description: "Bulk operations",
        icon: Package,
        color: "bg-orange-500",
      },
    ],
  };

  return (
    featuresMap[moduleId] || [
      {
        title: "Feature 1",
        description: "Core functionality",
        icon: BookOpen,
        color: "bg-blue-500",
      },
      {
        title: "Feature 2",
        description: "Advanced tools",
        icon: Settings,
        color: "bg-green-500",
      },
      {
        title: "Feature 3",
        description: "Analytics & reports",
        icon: FileText,
        color: "bg-purple-500",
      },
      {
        title: "Feature 4",
        description: "User management",
        icon: Users,
        color: "bg-orange-500",
      },
    ]
  );
};

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Load institutions from entity.json
  const { institutions, loading: institutionsLoading, error: institutionsError } = useInstitutions();

  // Get selected module from landing page
  const selectedModule = location.state?.selectedModule;
  const moduleData = location.state?.moduleData;

  // Get selected role from landing page
  const selectedRole = location.state?.selectedRole;
  const rolePreselected = location.state?.rolePreselected;
  const roleData = location.state?.roleData;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(selectedRole || "");
  const [institution, setInstitution] = useState("");
  const [selectedInstitutionDetails, setSelectedInstitutionDetails] =
    useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Check for existing valid session on component mount
  useEffect(() => {
    if (SessionManager.isValidSession()) {
      const sessionInfo = SessionManager.getSessionInfo();
      if (sessionInfo.isValid && sessionInfo.user) {
        console.log("Valid session found for user:", sessionInfo.user.email);
        console.log(
          "Session time remaining:",
          Math.round(sessionInfo.timeRemaining / 1000 / 60),
          "minutes",
        );
      }
    } else {
      console.log("No valid session found, user needs to login");
    }
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const availableRoles = [
    { value: "super-admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "principal", label: "Principal" },
    { value: "hod", label: "Head of Department (HOD)" },
    { value: "faculty", label: "Faculty" },
    { value: "student", label: "Student" },
    { value: "parent", label: "Parent" },
  ];

  // Note: institutions array is used directly by InstitutionComboBox

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate role is selected
    if (!role) {
      setError("Please select your role.");
      setIsLoading(false);
      return;
    }

    // Validate institution is selected for non-super-admin roles
    if (role !== "super-admin" && !institution) {
      setError("Please select an institution for your role.");
      setIsLoading(false);
      return;
    }

    console.log("🔐 Login form validation passed:", {
      email,
      role,
      institution,
    });
    console.log("🏢 Selected institution details:", selectedInstitutionDetails);

    try {
      const success = await login(email, password, { role, institution });
      if (success) {
        // Login successful, session storage will be handled by AuthContext
        console.log("Login successful, session created");

        // Navigate to module dashboard if module was selected, otherwise to general dashboard
        if (moduleData) {
          // Define implemented modules
          const implementedModules = [
            "master-setup",
            "academic-operation",
            "lms",
            "examination",
          ];

          // Check if module is implemented
          if (implementedModules.includes(selectedModule)) {
            // Route to appropriate module dashboard page based on moduleId
            switch (selectedModule) {
              case "master-setup":
                navigate("/dashboard", { replace: true }); // Master setup uses main dashboard with module state
                break;
              case "academic-operation":
                navigate("/academics", { replace: true });
                break;
              case "lms":
                navigate("/lms", { replace: true });
                break;
              case "examination":
                navigate("/exams", { replace: true });
                break;
              default:
                navigate("/dashboard", { replace: true });
            }
          } else {
            // Route to placeholder page for unimplemented modules
            const routeMap: { [key: string]: string } = {
              "student-support": "/student-support",
              admission: "/admission",
              "alumni-management": "/alumni-management",
              hostel: "/hostel",
              library: "/library",
              procurement: "/procurement",
              "asset-management": "/asset-management",
              hrms: "/hrms",
              payroll: "/payroll",
              affiliation: "/affiliation",
              gte: "/gte",
              research: "/research",
            };

            const route = routeMap[selectedModule] || "/dashboard";
            navigate(route, { replace: true });
          }
        } else {
          // Role-based multi-module dashboard
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      } relative overflow-hidden`}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${darkMode ? "bg-white/10" : "bg-blue-200/30"}`}
            style={{
              width: Math.random() * 8 + 4 + "px",
              height: Math.random() * 8 + 4 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left Side - Welcome Section - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  size="sm"
                  className={`${
                    darkMode
                      ? "text-white hover:bg-white/10"
                      : "text-gray-700 hover:bg-gray-100/50"
                  } transition-all duration-300`}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Modules
                </Button>

                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${
                    darkMode
                      ? "border-white/20 bg-white/10 hover:bg-white/20"
                      : "border-gray-200 bg-white/50 hover:bg-white/80"
                  } backdrop-blur-sm transition-all duration-300`}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div
                  className={`p-4 rounded-2xl ${
                    darkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  } shadow-2xl`}
                >
                  <School className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${
                      darkMode
                        ? "from-white to-blue-200"
                        : "from-gray-800 to-blue-600"
                    } bg-clip-text text-transparent`}
                  >
                    DOTE ERP
                  </h1>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Educational Management System
                  </p>
                </div>
              </div>

              {/*<div className="space-y-4">
                <h2
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Welcome Back!
                </h2>
                <p
                  className={`text-lg sm:text-xl ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed max-w-lg mx-auto lg:mx-0`}
                >
                  Sign in to access your personalized dashboard and manage your
                  educational institution seamlessly. Experience comprehensive
                  management tools designed for modern educational environments.
                </p>
              </div>*/}
            </div>

            {moduleData && (
              <div
                className={`p-8 rounded-2xl ${
                  darkMode
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/70 border border-white/40"
                } backdrop-blur-lg space-y-6`}
              >
                {/* Module Header */}
                <div className="flex items-start gap-8">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                      <img
                        src={moduleData.image}
                        alt={moduleData.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${moduleData.gradient} opacity-60`}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        const IconComponent = getModuleIcon(moduleData.id);
                        return (
                          <IconComponent className="h-12 w-12 text-white drop-shadow-lg" />
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <h3
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          darkMode ? "text-blue-200" : "text-blue-600"
                        }`}
                      >
                        Accessing Module
                      </h3>
                    </div>
                    <h2
                      className={`text-4xl font-bold mb-3 leading-tight ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {moduleData.title}
                    </h2>
                    <p
                      className={`text-xl leading-relaxed ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {moduleData.description}
                    </p>
                  </div>
                </div>

                {/* Key Features Section */}
                <div className="space-y-4">
                  <h4
                    className={`text-lg font-semibold flex items-center gap-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getModuleFeatures(moduleData.id).map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          darkMode
                            ? "bg-white/5 border border-white/10"
                            : "bg-white/50 border border-white/30"
                        } backdrop-blur-sm`}
                      >
                        <div className={`p-2 rounded-lg ${feature.color}`}>
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p
                            className={`font-medium text-sm ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {feature.title}
                          </p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Access Notice */}
                <div
                  className={`p-4 rounded-xl border-l-4 border-blue-500 ${
                    darkMode
                      ? "bg-blue-500/10 border-blue-400/20"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    <p
                      className={`font-semibold text-sm ${
                        darkMode ? "text-blue-200" : "text-blue-700"
                      }`}
                    >
                      Secure Access Required
                    </p>
                  </div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    Sign in with your credentials to access {moduleData.title}{" "}
                    features, manage data, and utilize advanced functionalities
                    with role-based permissions.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* System Features - Only show when no module is selected */}
              {!moduleData && (
                <div className="space-y-4">
                  <h3
                    className={`text-xl font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Comprehensive ERP Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          Academic Management
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Student records & curriculum
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500">
                        <Monitor className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          Learning Management
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Online courses & assessments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          Examination System
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Exam planning & evaluation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          System Administration
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          User roles & configurations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Secure Authentication
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Role-Based Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form - Takes 2 columns */}
          <div className="lg:col-span-2 w-full max-w-md mx-auto lg:max-w-full order-1 lg:order-2">
            <Card
              className={`${
                darkMode
                  ? "bg-white/10 border-white/20"
                  : "bg-white/70 border-white/50"
              } backdrop-blur-xl shadow-2xl rounded-2xl border transition-all duration-300`}
            >
              <CardHeader className="space-y-1 pb-4 sm:pb-6">
                <CardTitle
                  className={`text-xl sm:text-2xl font-bold text-center ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Sign In
                </CardTitle>
                <CardDescription
                  className={`text-center ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={`flex items-center gap-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className={`${
                        darkMode
                          ? "bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          : "bg-white/80 border-gray-200"
                      } rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className={`flex items-center gap-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className={`${
                          darkMode
                            ? "bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            : "bg-white/80 border-gray-200"
                        } rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 pr-12`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className={`flex items-center gap-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      Role
                      {rolePreselected && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          Pre-selected
                        </span>
                      )}
                    </Label>
                    <Select
                      value={role}
                      onValueChange={setRole}
                      disabled={isLoading || rolePreselected}
                    >
                      <SelectTrigger
                        className={`${
                          darkMode
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/80 border-gray-200"
                        } rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
                          rolePreselected
                            ? "cursor-not-allowed opacity-75"
                            : "cursor-pointer"
                        }`}
                      >
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent
                        className={`${
                          darkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } rounded-xl backdrop-blur-sm`}
                      >
                        {availableRoles.map((roleOption) => (
                          <SelectItem
                            key={roleOption.value}
                            value={roleOption.value}
                          >
                            {roleOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {rolePreselected && (
                      <p
                        className={`text-xs mt-1 ${
                          darkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      >
                        Role selected from landing page. To change, go back and
                        select a different role.
                      </p>
                    )}
                  </div>

                  {/* Institution Field - Hidden for Super Admin */}
                  {role !== "super-admin" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="institution"
                        className={`flex items-center gap-2 ${
                          darkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        <Building className="h-4 w-4" />
                        Institution
                        <span className="text-red-500">*</span>
                      </Label>
                      <InstitutionComboBox
                        institutions={institutions}
                        value={institution}
                        onValueChange={(value) => {
                          setInstitution(value);
                          const institutionDetails = institutions.find(
                            (inst) => inst.id.toString() === value
                          );
                          setSelectedInstitutionDetails(institutionDetails);
                          console.log(
                            "🏢 Institution selected:",
                            institutionDetails,
                          );
                        }}
                        disabled={isLoading || institutionsLoading}
                        loading={institutionsLoading}
                        darkMode={darkMode}
                        placeholder={
                          institutionsLoading
                            ? "Loading institutions..."
                            : "Search or select your institution..."
                        }
                      />
                    </div>
                  )}

                  {/* Institution Details Display */}
                  {selectedInstitutionDetails && (
                    <div
                      className={`space-y-3 p-4 rounded-xl border ${
                        darkMode
                          ? "bg-white/5 border-white/10"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        <h4
                          className={`font-semibold text-sm ${
                            darkMode ? "text-blue-200" : "text-blue-700"
                          }`}
                        >
                          Institution Details
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Name:
                          </span>{" "}
                          <span
                            className={`${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {selectedInstitutionDetails.name}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Code:
                          </span>{" "}
                          <span
                            className={`${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {selectedInstitutionDetails.code}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Type:
                          </span>{" "}
                          <span
                            className={`${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {selectedInstitutionDetails.university_type}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Location:
                          </span>{" "}
                          <span
                            className={`${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {selectedInstitutionDetails.city},{" "}
                            {selectedInstitutionDetails.state}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Accreditation:
                          </span>{" "}
                          <span
                            className={`${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {selectedInstitutionDetails.accreditation}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(error || institutionsError) && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertDescription>
                        {error || institutionsError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    disabled={isLoading || institutionsLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-5 w-5" />
                        Sign In to Dashboard
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p
              className={`text-center text-sm mt-6 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Need help? Contact your system administrator
            </p>

            {/* Debug Login Panel - Only show in development */}
            {/* {process.env.NODE_ENV === 'development' && (
              <DebugLogin />
            )} */}
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
