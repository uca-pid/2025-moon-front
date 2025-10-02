import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type MultiSelectProps = {
  options: { label: string; value: string }[]
  selected: string[]
  setSelected: (values: string[]) => void
  placeholder?: string
  hasInput?: boolean
}

export const MultiSelect = ({ options, selected, setSelected, placeholder, hasInput }: MultiSelectProps) => {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
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
            <CommandInput placeholder="Buscar..." className="w-full" />
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}
