"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// ✅ Define the type
type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

// ✅ Use the type here — this is what was missing
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
