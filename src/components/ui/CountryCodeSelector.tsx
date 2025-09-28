import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
];

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CountryCodeSelector = ({ value, onChange, className }: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedCountry = COUNTRY_CODES.find(country => country.code === value) || COUNTRY_CODES[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[120px] justify-between", className)}
        >
          <span className="flex items-center gap-2">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {COUNTRY_CODES.map((country) => (
              <CommandItem
                key={country.code}
                value={`${country.name} ${country.code}`}
                onSelect={() => {
                  onChange(country.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex items-center gap-2 flex-1">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-muted-foreground ml-auto">{country.code}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryCodeSelector;
