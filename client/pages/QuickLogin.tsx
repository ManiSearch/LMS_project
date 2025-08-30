import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuickLogin() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const quickLoginRoles = [
    {
      role: "super-admin",
      email: "superadmin@edu.com",
      name: "System Administrator",
      color: "bg-red-500",
    },
    {
      role: "admin",
      email: "admin@edu.com",
      name: "Dr.Manikandan",
      color: "bg-blue-500",
    },
    {
      role: "institution",
      email: "institution@edu.com",
      name: "Dr. Institution Head",
      color: "bg-green-500",
    },
    {
      role: "principal",
      email: "principal@edu.com",
      name: "Dr. Principal Kumar",
      color: "bg-purple-500",
    },
    {
      role: "hod",
      email: "hod@edu.com",
      name: "Dr.Karthick",
      color: "bg-orange-500",
    },
    {
      role: "faculty",
      email: "faculty@edu.com",
      name: "Prof.Madhan",
      color: "bg-cyan-500",
    },
    {
      role: "staff",
      email: "staff@edu.com",
      name: "Staff Member",
      color: "bg-yellow-500",
    },
    {
      role: "student",
      email: "student@edu.com",
      name: "Christy",
      color: "bg-pink-500",
    },
    {
      role: "parent",
      email: "parent@edu.com",
      name: "Murugan",
      color: "bg-gray-500",
    },
  ];

  const handleQuickLogin = async (email: string, roleName: string) => {
    try {
      console.log(`Attempting quick login as ${roleName} (${email})`);
      const success = await login(email, "password");

      if (success) {
        console.log(`✅ Quick login successful as ${roleName}`);
        navigate("/dashboard");
      } else {
        console.error(`❌ Quick login failed for ${roleName}`);
        alert(`Login failed for ${roleName}`);
      }
    } catch (error) {
      console.error("Quick login error:", error);
      alert("Login error occurred");
    }
  };

  const goToCoursesDirectly = () => {
    navigate("/lms/courses");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Quick Login - Debug Auth Issues
          </CardTitle>
          {user && (
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-green-800">
                Currently logged in as: <strong>{user.name}</strong> (
                {user.role})
              </p>
              <Button onClick={goToCoursesDirectly} className="mt-2" size="sm">
                Go to Courses Page
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLoginRoles.map((roleInfo) => (
              <Card
                key={roleInfo.role}
                className="border-2 hover:border-blue-300 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      className={`${roleInfo.color} text-white text-xs px-2 py-1`}
                    >
                      {roleInfo.role}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">
                    {roleInfo.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{roleInfo.email}</p>

                  <Button
                    onClick={() =>
                      handleQuickLogin(roleInfo.email, roleInfo.name)
                    }
                    className="w-full"
                    size="sm"
                    disabled={user?.role === roleInfo.role}
                  >
                    {user?.role === roleInfo.role
                      ? "Current User"
                      : `Login as ${roleInfo.role}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-800 mb-2">
              Debug Information:
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Use "super-admin" to access all modules including courses</p>
              <p>• Current authentication state will be logged to console</p>
              <p>• After login, you should be able to access /lms/courses</p>
              {user && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <strong>Current Session:</strong>
                  <br />
                  User: {user.name} ({user.email})
                  <br />
                  Role: {user.role}
                  <br />
                  Login Time: {user.loginTime}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
