import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { setColorMode } = useColorMode();

  const handleToggle = () => {
    toggleTheme();
    setColorMode(isDarkMode ? "light" : "dark");
  };

  return (
    <IconButton
      icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
      onClick={handleToggle}
      variant="ghost"
      colorScheme="blue"
      aria-label="Toggle theme"
    />
  );
};

export default ThemeToggle;
