import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative h-12 w-24 rounded-full border border-border bg-muted p-1 transition-colors"
      aria-label="Toggle dark mode"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-md transition-transform duration-300 ${
          theme === "dark" ? "translate-x-12" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon size={18} className="text-secondary" />
        ) : (
          <Sun size={18} className="text-sunshine" />
        )}
      </div>
    </button>
  );
}
