import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="pm-theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        theme === "dark" ? "light" : "dark"
      } mode`}
      title={`Switch to ${
        theme === "dark" ? "light" : "dark"
      } mode`}
    >
      <span className="pm-theme-icon">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>

      <span className="pm-theme-text">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;