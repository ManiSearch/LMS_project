import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  DataFilterService,
  FilteredDataContext as FilterContext,
  Student,
  Faculty,
  Subject,
  Grade,
} from "@/services/dataFilterService";

interface FilteredDataState {
  students: Student[];
  faculty: Faculty[];
  subjects: Subject[];
  grades: Grade[];
  dashboardStats: any;
  isLoading: boolean;
  refreshData: () => void;
}

const FilteredDataContext = createContext<FilteredDataState | undefined>(
  undefined,
);

export const useFilteredData = () => {
  const context = useContext(FilteredDataContext);
  if (!context) {
    throw new Error(
      "useFilteredData must be used within a FilteredDataProvider",
    );
  }
  return context;
};

interface FilteredDataProviderProps {
  children: React.ReactNode;
}

export const FilteredDataProvider: React.FC<FilteredDataProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = React.useCallback(() => {
    if (!user || !isAuthenticated) {
      setStudents([]);
      setFaculty([]);
      setSubjects([]);
      setGrades([]);
      setDashboardStats(null);
      return;
    }

    setIsLoading(true);

    const filterContext: FilterContext = {
      userId: user.id,
      role: user.role,
      institution: user.institution,
      institutionId: user.institutionId || user.selectedInstitutionId,
      institutionCode: user.institutionCode || user.selectedInstitutionCode,
      department: user.department,
      studentId: user.studentId,
    };

    try {
      // Filter data based on user role and context
      const filteredStudents =
        DataFilterService.getFilteredStudents(filterContext);
      const filteredFaculty =
        DataFilterService.getFilteredFaculty(filterContext);
      const filteredSubjects =
        DataFilterService.getFilteredSubjects(filterContext);
      const filteredGrades = DataFilterService.getFilteredGrades(filterContext);
      const stats = DataFilterService.getDashboardStats(filterContext);

      setStudents(filteredStudents);
      setFaculty(filteredFaculty);
      setSubjects(filteredSubjects);
      setGrades(filteredGrades);
      setDashboardStats(stats);

      console.log(`🔍 Data filtered for ${user.role}:`, {
        role: user.role,
        institution: user.institution,
        institutionId: user.institutionId || user.selectedInstitutionId,
        institutionCode: user.institutionCode || user.selectedInstitutionCode,
        department: user.department,
        studentCount: filteredStudents.length,
        facultyCount: filteredFaculty.length,
        subjectCount: filteredSubjects.length,
        gradeCount: filteredGrades.length,
      });
    } catch (error) {
      console.error("Error filtering data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const value: FilteredDataState = {
    students,
    faculty,
    subjects,
    grades,
    dashboardStats,
    isLoading,
    refreshData,
  };

  return (
    <FilteredDataContext.Provider value={value}>
      {children}
    </FilteredDataContext.Provider>
  );
};

// Hook for getting filtered data for specific entities
export const useFilteredStudents = () => {
  const { students, isLoading } = useFilteredData();
  return { students, isLoading };
};

export const useFilteredFaculty = () => {
  const { faculty, isLoading } = useFilteredData();
  return { faculty, isLoading };
};

export const useFilteredSubjects = () => {
  const { subjects, isLoading } = useFilteredData();
  return { subjects, isLoading };
};

export const useFilteredGrades = () => {
  const { grades, isLoading } = useFilteredData();
  return { grades, isLoading };
};

export const useFilteredDashboardStats = () => {
  const { dashboardStats, isLoading } = useFilteredData();
  return { dashboardStats, isLoading };
};
