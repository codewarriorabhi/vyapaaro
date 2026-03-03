import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  location?: string;
}

const SearchBar = ({ value, onChange, location = "Sector 22, Chandigarh" }: SearchBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">{location}</span>
      </div>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shops, products, or categories..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12 rounded-xl bg-card shadow-card border-0 text-base placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
};

export default SearchBar;
