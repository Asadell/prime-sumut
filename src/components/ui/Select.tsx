"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  name?: string; // For form integration
  required?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  className,
  name,
  required,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search query when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter options if list is long (e.g. Kawasan)
  const showSearch = options.length > 8;
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("relative w-full min-w-[120px] text-left", className)} ref={containerRef}>
      {/* Hidden input for HTML form submissions */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      )}

      {/* Select Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[13px] text-[#1A1A1A] outline-none transition-all cursor-pointer select-none",
          isOpen ? "border-[#C9A961] ring-1 ring-[#C9A961]" : "hover:border-[#C9A961]"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-[#999]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#6B6B6B] transition-transform duration-200 shrink-0 ml-2",
            isOpen && "transform rotate-180 text-[#C9A961]"
          )}
        />
      </button>

      {/* Options Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-1.5 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-[300px] flex flex-col overflow-hidden"
          >
            {/* Search Input (for long lists) */}
            {showSearch && (
              <div className="p-2 border-b border-[#F0F0F0] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md pl-8 pr-3 py-1.5 text-[12px] outline-none focus:border-[#C9A961]"
                />
              </div>
            )}

            {/* Scrollable list of items */}
            <div className="overflow-y-auto py-1 flex-1 max-h-[220px]">
              {filteredOptions.length === 0 ? (
                <div className="px-3.5 py-2.5 text-[13px] text-[#999] text-center">
                  Tidak ada pilihan
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] text-[#1A1A1A] transition-colors text-left hover:bg-[#FEF9EC] hover:text-[#1A1A1A] cursor-pointer",
                        isSelected && "bg-[#FEF9EC] font-semibold text-[#C9A961]"
                      )}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#C9A961] shrink-0 ml-2" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
