"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowUpRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("product");
  // Mock data for the product list as per screenshot
  const [results] = useState([
    "Product Name Here",
    "Product Name Here",
    "Product Name Here",
    "Product Name Here",
    "Product Name Here",
    "Product Name Here",
    "Product Name Here",
  ]);

  // Handle search button click
  const handleSearch = () => {
    console.log("Search type:", searchType);
    // console.log("Search term:", searchTerm);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] flex justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-2 flex items-center shadow-xl">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-3 text-lg outline-none text-gray-700 placeholder:text-gray-400 bg-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchType(e.target.value);
            }}
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="bg-[#7E1800] hover:bg-[#601200] text-white px-6 py-3 rounded-md flex items-center gap-2 font-medium transition-colors cursor-pointer"
          >
            <Search size={20} />
            Search
          </button>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-lg overflow-hidden shadow-xl py-2">
          {results.map((result, index) => (
            <div
              key={index}
              className="group flex justify-between items-center px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0 border-gray-100"
            >
              <span className="text-gray-700 font-medium text-lg">
                {result}
              </span>
              <ArrowUpRight
                className="text-gray-400 group-hover:text-[#7E1800] transition-colors"
                size={20}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
