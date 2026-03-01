"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TrendsFilters as TrendsFiltersType,
  TrendsMetadata,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface TrendsFiltersProps {
  filters: TrendsFiltersType;
  metadata: TrendsMetadata;
  onFiltersChange: (filters: TrendsFiltersType) => void;
}

export function TrendsFilters({
  filters,
  metadata,
  onFiltersChange,
}: TrendsFiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Year</span>
        <Select
          value={filters.year ? String(filters.year) : "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              year: v === "all" ? undefined : Number(v),
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {metadata.years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Location
        </span>
        <Select
          value={filters.location ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              location: v === "all" ? undefined : v,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              <SelectItem value="all">All Locations</SelectItem>
              {metadata.locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Category
        </span>
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-between font-normal"
            >
              {filters.category ?? "All Categories"}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="__all__"
                    onSelect={() => {
                      onFiltersChange({ ...filters, category: undefined });
                      setCategoryOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        !filters.category ? "opacity-100" : "opacity-0",
                      )}
                    />
                    All Categories
                  </CommandItem>
                  {metadata.categories.map((c) => (
                    <CommandItem
                      key={c}
                      value={c}
                      onSelect={() => {
                        onFiltersChange({ ...filters, category: c });
                        setCategoryOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          filters.category === c ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {c}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {(filters.year || filters.location || filters.category) && (
        <Button variant="outline" size="sm" onClick={() => onFiltersChange({})}>
          <X className="mr-1 size-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
