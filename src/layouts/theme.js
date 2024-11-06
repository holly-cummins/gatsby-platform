import React from "react";
import { createContext, useContext } from "react";

import themeObjectFromYaml from "../theme/theme.yaml";

const ThemeContext = createContext(themeObjectFromYaml);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {

  return (
    <ThemeContext.Provider value={themeObjectFromYaml}>
      {children}
    </ThemeContext.Provider>
  );
};
