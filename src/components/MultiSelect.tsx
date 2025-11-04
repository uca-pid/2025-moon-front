import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandGroup, CommandInput, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronDownIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type MultiSelectProps = {
  options: { label: string; value: string }[]
  selected: string[]
  setSelected: (values: string[]) => void
  placeholder?: string
  hasInput?: boolean
  onCreate?: (value: string) => void
}

export const MultiSelect = ({ options, selected, setSelected, placeholder, hasInput, onCreate }: MultiSelectProps) => {
  const [search, setSearch] = useState("")
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const normalizedSearch = search.trim().toLowerCase()
  const hasExactMatch = normalizedSearch.length > 0 && options.some((o) => o.label.trim().toLowerCase() === normalizedSearch)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          style={{ padding: "25px" }}
        >
          {selected.length > 0
            ? selected.length === 1 ? options.find(option => option.value === selected[0])?.label : `${selected.length} seleccionados`
            : placeholder ?? "Selecciona..."}
            <ChevronDownIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command className="w-full">
          {hasInput && (
            <CommandInput
              placeholder="Buscar..."
              className="w-full"
              value={search}
              onValueChange={setSearch}
            />
          )}
          <CommandGroup className="max-h-[200px] w-full overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>
            <span>No hay resultados</span>
          </CommandEmpty>
          {onCreate && normalizedSearch.length > 0 && !hasExactMatch && (
            <div className="border-t p-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onCreate?.(search.trim())}
              >
                <Plus className="mr-2" /> Crear "{search.trim()}"
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
