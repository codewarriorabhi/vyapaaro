import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";

const LocationSettings = () => {
  const [autoDetect, setAutoDetect] = useState(true);
  const [locationSearch, setLocationSearch] = useState("");
  const [radius, setRadius] = useState("5");
  const [detecting, setDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Not supported", description: "Geolocation is not supported by your browser.", variant: "destructive" });
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setDetecting(false);
        toast({ title: "Location detected" });
      },
      () => {
        setDetecting(false);
        toast({ title: "Location access denied", variant: "destructive" });
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Location Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Control how we detect and use your location</p>
      </div>

      {/* Auto-detect toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Navigation className="h-4 w-4 text-primary" />
          </div>
          <div>
            <Label htmlFor="auto_detect" className="font-medium cursor-pointer">Auto-detect Location</Label>
            <p className="text-xs text-muted-foreground">Automatically detect your location</p>
          </div>
        </div>
        <Switch id="auto_detect" checked={autoDetect} onCheckedChange={setAutoDetect} />
      </div>

      {autoDetect && (
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDetectLocation} disabled={detecting}>
            {detecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
            Detect Now
          </Button>
          {detectedLocation && (
            <span className="text-sm text-muted-foreground">📍 {detectedLocation}</span>
          )}
        </div>
      )}

      {/* Manual location */}
      {!autoDetect && (
        <div className="space-y-2">
          <Label htmlFor="location_search">Search Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location_search"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Enter city, area, or pincode..."
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Radius filter */}
      <div className="space-y-2">
        <Label>Radius Filter</Label>
        <Select value={radius} onValueChange={setRadius}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 km</SelectItem>
            <SelectItem value="5">5 km</SelectItem>
            <SelectItem value="10">10 km</SelectItem>
            <SelectItem value="25">25 km</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map preview placeholder */}
      <div className="rounded-xl border border-border bg-muted/30 h-48 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Map preview coming soon</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => toast({ title: "Location settings saved" })}>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default LocationSettings;
