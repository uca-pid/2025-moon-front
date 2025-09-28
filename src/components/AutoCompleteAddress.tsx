import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { fetchAddressDetails, fetchSuggestions } from '@/services/address'
import type { Address } from '@/types/address.types'

export function AddressAutocompleteNew({
  value,
  onChange,
  onSelect,
  onResolved,
  invalid,
  errorText,
}: {
  value: string
  onChange: (v: string) => void
  onSelect: (selected: string) => void
  onResolved?: (data: {
    placeId?: string
    text: string
    formattedAddress?: string
    lat?: number
    lng?: number
    hasStreetNumber?: boolean
  }) => void
  invalid?: boolean
  errorText?: string
}) {
  const [suggestions, setSuggestions] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setSuggestions([])
      setLoading(false)
      return
    }
    const input = value.trim()
    if (input.length < 3) {
      setSuggestions([])
      return
    }
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        setLoading(true)
        const envVars = import.meta.env as unknown as Record<
          string,
          string | undefined
        >
        const apiKey = (envVars.VITE_GOOGLE_PLACES_API_KEY ||
          envVars.VITE_GOOGLE_MAPS_API_KEY) as string | undefined
        if (!apiKey) {
          setSuggestions([])
          setLoading(false)
          return
        }
        const data = await fetchSuggestions(input, controller.signal)
        if (!data) {
          console.error('Places Autocomplete error', data)
          setSuggestions([])
        } else {
          const list: Address[] = data ?? []
          setSuggestions(list)
        }
      } catch (err) {
        if ((err as { name?: string }).name !== 'AbortError') console.error(err)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [value, isFocused])

  const open = isFocused && (loading || suggestions.length > 0)
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setSuggestions([])
          setLoading(false)
        }
      }}
    >
      <PopoverAnchor asChild>
        <div className='w-full'>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder='Ingresá tu dirección'
            autoComplete='off'
            aria-invalid={invalid || undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </PopoverAnchor>
      {open ? (
        <PopoverContent
          align='start'
          className='p-0 w-[var(--radix-popover-trigger-width)]'
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ul className='max-h-60 overflow-auto text-sm'>
            {loading ? (
              <li className='px-3 py-2 text-muted-foreground'>Buscando...</li>
            ) : (
              suggestions.map((sug, idx) => {
                return (
                  <li
                    key={idx}
                    className='px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground'
                    onMouseDown={async (e) => {
                      e.preventDefault()
                      console.log(sug)
                      onSelect(sug.text)
                      onChange(sug.text)
                      try {
                        console.log(sug.placeId)
                        const details = await fetchAddressDetails(sug.placeId)
                        const lat = details?.location?.latitude as
                          | number
                          | undefined
                        const lng = details?.location?.longitude as
                          | number
                          | undefined
                        const comps = details?.addressComponents ?? []
                        const hasStreetNumber = comps.some((c) =>
                          (c.types ?? []).includes('street_number')
                        )
                        onResolved?.({
                          placeId: sug.placeId,
                          text: sug.text,
                          formattedAddress: details.text,
                          lat,
                          lng,
                          hasStreetNumber,
                        })
                      } catch {
                        onResolved?.({
                          placeId: sug.placeId,
                          text: sug.text,
                        })
                      }
                      setSuggestions([])
                    }}
                  >
                    {sug.text}
                  </li>
                )
              })
            )}
          </ul>
        </PopoverContent>
      ) : null}
      {invalid && errorText ? (
        <p className='mt-1 text-xs text-destructive'>{errorText}</p>
      ) : null}
    </Popover>
  )
}
