import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'

type Suggestion = {
  placePrediction?: {
    placeId: string
    text: {
      text: string
    }
  }
  queryPrediction?: {
    text: {
      text: string
    }
  }
}

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
  onSelect: (selected: Suggestion['placePrediction']) => void
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
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
        const envVars = import.meta.env as unknown as Record<string, string | undefined>
        const apiKey = (envVars.VITE_GOOGLE_PLACES_API_KEY || envVars.VITE_GOOGLE_MAPS_API_KEY) as string | undefined
        if (!apiKey) {
          setSuggestions([])
          setLoading(false)
          return
        }
        const body = {
          input: input,
          languageCode: 'es',
          includedRegionCodes: ['AR'],
          locationBias: {
            circle: {
              center: { latitude: -34.6037, longitude: -58.3816 },
              radius: 50000,
            },
          },
          sessionToken: crypto.randomUUID(),
        }
        const resp = await fetch(
          'https://places.googleapis.com/v1/places:autocomplete',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': [
                'suggestions.placePrediction.placeId',
                'suggestions.placePrediction.text',
                'suggestions.queryPrediction.text',
              ].join(','),
            },
            body: JSON.stringify(body),
            signal: controller.signal,
          }
        )
        const data = await resp.json()
        if (!resp.ok) {
          console.error('Places Autocomplete error', data)
          setSuggestions([])
        } else {
          const list: Suggestion[] = data.suggestions ?? []
          const filtered = list.filter((s: Suggestion) => {
            const t = s.placePrediction?.text.text ?? s.queryPrediction?.text.text ?? ''
            return /(buenos\s*aires|caba|capital\s*federal)/i.test(t)
          })
          setSuggestions(filtered.length > 0 ? filtered : list)
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
        <div className="w-full">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ingresá tu dirección"
            autoComplete="off"
            aria-invalid={invalid || undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </PopoverAnchor>
      {open ? (
        <PopoverContent
          align="start"
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ul className="max-h-60 overflow-auto text-sm">
            {loading ? (
              <li className="px-3 py-2 text-muted-foreground">Buscando...</li>
            ) : (
              suggestions.map((sug, idx) => {
                const desc = sug.placePrediction
                  ? sug.placePrediction.text.text
                  : sug.queryPrediction
                  ? sug.queryPrediction.text.text
                  : ''
                return (
                  <li
                    key={idx}
                    className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={async (e) => {
                      e.preventDefault()
                      if (sug.placePrediction) {
                        onSelect(sug.placePrediction)
                        onChange(sug.placePrediction.text.text)
                        try {
                          const envVars = import.meta.env as unknown as Record<string, string | undefined>
                          const apiKey = (envVars.VITE_GOOGLE_PLACES_API_KEY || envVars.VITE_GOOGLE_MAPS_API_KEY) as string | undefined
                          if (apiKey) {
                            const detailsResp = await fetch(
                              `https://places.googleapis.com/v1/places/${encodeURIComponent(sug.placePrediction.placeId)}`,
                              {
                                method: 'GET',
                                headers: {
                                  'X-Goog-Api-Key': apiKey,
                                  'X-Goog-FieldMask': [
                                    'id',
                                    'displayName',
                                    'formattedAddress',
                                    'location',
                                    'addressComponents',
                                  ].join(','),
                                },
                              }
                            )
                            const details = await detailsResp.json()
                            const lat = details?.location?.latitude as number | undefined
                            const lng = details?.location?.longitude as number | undefined
                            const comps: Array<{ types?: string[] }> = details?.addressComponents ?? []
                            const hasStreetNumber = comps.some((c) => (c.types ?? []).includes('street_number'))
                            onResolved?.({
                              placeId: sug.placePrediction.placeId,
                              text: sug.placePrediction.text.text,
                              formattedAddress: details?.formattedAddress ?? undefined,
                              lat,
                              lng,
                              hasStreetNumber,
                            })
                          } else {
                            onResolved?.({
                              placeId: sug.placePrediction.placeId,
                              text: sug.placePrediction.text.text,
                            })
                          }
                        } catch {
                          onResolved?.({
                            placeId: sug.placePrediction.placeId,
                            text: sug.placePrediction.text.text,
                          })
                        }
                        setSuggestions([])
                      } else {
                        onChange(desc)
                        setSuggestions([])
                        onResolved?.({ text: desc })
                      }
                    }}
                  >
                    {desc}
                  </li>
                )
              })
            )}
          </ul>
        </PopoverContent>
      ) : null}
      {invalid && errorText ? (
        <p className="mt-1 text-xs text-destructive">{errorText}</p>
      ) : null}
    </Popover>
  )
}
