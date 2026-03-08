import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, Monitor, Globe, Loader2 } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

const themes = [
  { value: "light", label: "Light Mode", icon: Sun },
  { value: "dark", label: "Dark Mode", icon: Moon },
  { value: "system", label: "System Default", icon: Monitor },
];

const ThemeLanguageSettings = () => {
  const { settings, loading, saving, saveSettings, updateLocal } = useUserSettings();

  useEffect(() => {
    applyThemeToDOM(settings.theme);
  }, [settings.theme]);

  const applyThemeToDOM = (value: string) => {
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

  const handleThemeChange = (value: string) => {
    updateLocal({ theme: value });
    applyThemeToDOM(value);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Theme & Language</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize your app appearance and language</p>
      </div>

      <div className="space-y-3">
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                settings.theme === value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Icon className={`h-6 w-6 ${settings.theme === value ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Language</Label>
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={settings.language} onValueChange={(v) => updateLocal({ language: v })}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => saveSettings({ theme: settings.theme, language: settings.language })} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
        </Button>
        <Button variant="outline" disabled={saving}>Cancel</Button>
      </div>
    </div>
  );
};

export default ThemeLanguageSettings;
