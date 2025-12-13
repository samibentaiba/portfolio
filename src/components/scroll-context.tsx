"use client";

import { createContext, useContext } from "react";

type ScrollContextType = {
  activeSection: string | null;
};

const ScrollContext = createContext<ScrollContextType>({
  activeSection: null,
});

export const useScrollContext = () => useContext(ScrollContext);

export const ScrollProvider = ({
  children,
  activeSection,
}: {
  children: React.ReactNode;
  activeSection: string | null;
}) => {
  return (
    <ScrollContext.Provider value={{ activeSection }}>
      {children}
    </ScrollContext.Provider>
  );
};
