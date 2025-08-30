import React, { useState } from "react";
import { Check, ChevronsUpDown, Search, Building, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Institution {
  id: number;
  name: string;
  code: string;
  [key: string]: any;
}

interface InstitutionComboBoxProps {
  /** Array of institution objects to display in the dropdown */
  institutions: Institution[];
  /** Currently selected institution ID as string */
  value: string;
  /** Callback fired when institution selection changes */
  onValueChange: (value: string) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether institutions are currently loading */
  loading?: boolean;
  /** Whether to use dark mode styling */
  darkMode?: boolean;
  /** Placeholder text when no institution is selected */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * InstitutionComboBox - A searchable combobox for selecting institutions
 *
 * Features:
 * - Type-to-search functionality by institution name, code, or type
 * - Dropdown selection with keyboard navigation
 * - Clear selection button
 * - Dark mode support
 * - Loading states
 * - Responsive design
 *
 * Usage:
 * ```tsx
 * <InstitutionComboBox
 *   institutions={institutions}
 *   value={selectedInstitutionId}
 *   onValueChange={setSelectedInstitutionId}
 *   darkMode={isDarkMode}
 *   placeholder="Search or select your institution..."
 * />
 * ```
 */

export function InstitutionComboBox({
  institutions,
  value,
  onValueChange,
  disabled = false,
  loading = false,
  darkMode = false,
  placeholder = "Search or select your institution...",
  className,
}: InstitutionComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");


  // Find selected institution for display
  const selectedInstitution = institutions.find(
    (inst) => inst.id.toString() === value
  );

  // Filter institutions based on search (name, code, and partial matches)
  const filteredInstitutions = institutions.filter((inst) => {
    if (!searchValue.trim()) {
      return true; // Show all institutions when no search term
    }

    const searchLower = searchValue.toLowerCase().trim();
    const nameLower = inst.name.toLowerCase();
    const codeLower = inst.code.toLowerCase();

    return (
      // Direct substring match in name
      nameLower.includes(searchLower) ||
      // Direct substring match in code
      codeLower.includes(searchLower) ||
      // Word-based search within the institution name
      nameLower.split(' ').some(word =>
        word.startsWith(searchLower) || word.includes(searchLower)
      ) ||
      // Search by institution type/category keywords
      (inst.type && inst.type.toLowerCase().includes(searchLower)) ||
      // Search for common abbreviations and partial matches
      searchLower.split(' ').every(searchWord =>
        nameLower.includes(searchWord) || codeLower.includes(searchWord)
      ) ||
      // Additional fuzzy matching for common terms
      (searchLower.includes('govt') && nameLower.includes('government')) ||
      (searchLower.includes('poly') && nameLower.includes('polytechnic')) ||
      (searchLower.includes('college') && nameLower.includes('college')) ||
      (searchLower.includes('institute') && nameLower.includes('institute'))
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            "w-full justify-between rounded-xl backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500",
            darkMode
              ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
              : "bg-white/80 border-gray-200 hover:bg-white/90",
            className
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Building className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {loading
                ? "Loading institutions..."
                : selectedInstitution
                ? selectedInstitution.name
                : placeholder}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {selectedInstitution && !loading && (
              <div
                className="h-4 w-4 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-50 hover:opacity-100 cursor-pointer transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange("");
                }}
                role="button"
                tabIndex={0}
                aria-label="Clear selection"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onValueChange("");
                  }
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-[400px] p-0 rounded-xl backdrop-blur-sm border",
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
        align="start"
      >
        <Command
          className={cn(
            "w-full",
            darkMode ? "bg-gray-800" : "bg-white"
          )}
          shouldFilter={false}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search institutions by name or code..."
              className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0",
                darkMode
                  ? "text-white placeholder:text-gray-400"
                  : "text-gray-900 placeholder:text-gray-500"
              )}
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {searchValue.trim()
                ? `No institutions found for "${searchValue}". Try searching for partial names or codes.`
                : "No institutions available."
              }
            </CommandEmpty>
            <CommandGroup>
              {filteredInstitutions.map((institution) => (
                <CommandItem
                  key={institution.id}
                  value={institution.id.toString()}
                  keywords={[institution.name, institution.code, institution.type || ''].filter(Boolean)}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    onValueChange(newValue);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer",
                    darkMode
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-medium text-sm truncate w-full">
                      {institution.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={cn(
                          "font-mono",
                          darkMode ? "text-gray-400" : "text-gray-500"
                        )}
                      >
                        {institution.code}
                      </span>
                      {institution.type && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span
                            className={cn(
                              "capitalize",
                              darkMode ? "text-gray-400" : "text-gray-500"
                            )}
                          >
                            {institution.type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === institution.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        
        {/* Show helpful text and stats */}
        <div
          className={cn(
            "px-3 py-2 border-t text-xs space-y-1",
            darkMode
              ? "text-gray-400 border-gray-700"
              : "text-gray-500 border-gray-200"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Type to search by name, code, or type
            </div>
            <span className="text-xs">
              {searchValue.trim()
                ? `${filteredInstitutions.length} of ${institutions.length} institutions`
                : `${institutions.length} institutions`
              }
            </span>
          </div>
          {searchValue && filteredInstitutions.length === 0 && (
            <div className="text-xs italic">
              Try searching for partial names or institution codes
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
