import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Sun, Moon, Monitor, Globe } from "lucide-react";

const themes = [
  { value: "light", label: "Light Mode", icon: Sun },
  { value: "dark", label: "Dark Mode", icon: Moon },
  { value: "system", label: "System Default", icon: Monitor },
];

const ThemeLanguageSettings = () => {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "system";
    setTheme(stored);
  }, []);

  const applyTheme = (value: string) => {
    setTheme(value);
    const root = document.documentElement;
    if (value === "dark") {
      root.classList.add("dark");
    } else if (value === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
    localStorage.setItem("theme", value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Theme & Language</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize your app appearance and language</p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => applyTheme(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Icon className={`h-6 w-6 ${theme === value ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <Label>Language</Label>
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => toast({ title: "Preferences saved" })}>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default ThemeLanguageSettings;
