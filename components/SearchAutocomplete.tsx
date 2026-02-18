"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"

interface SearchResult {
  type: "Fachbereich" | "Themenkomplex" | "Frage"
  name: string
  href: string
}

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setResults(data)
          setIsOpen(true)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    fetchResults(query)
  }, [query, fetchResults])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      router.push(results[selectedIndex].href)
      setIsOpen(false)
      setQuery("")
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const typeBadgeStyles: Record<string, string> = {
    Fachbereich: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Themenkomplex: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Frage: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Fachbereiche, Themenkomplexe oder Fragen suchen..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          className="pl-10"
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-auto py-1">
              {results.map((result, index) => (
                <li key={`${result.type}-${index}`}>
                  <button
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent ${
                      index === selectedIndex ? "bg-accent" : ""
                    }`}
                    onClick={() => {
                      router.push(result.href)
                      setIsOpen(false)
                      setQuery("")
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeStyles[result.type]}`}
                    >
                      {result.type}
                    </span>
                    <span className="truncate">{result.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Keine Ergebnisse gefunden.
            </div>
          )}
        </div>
      )}
      {isLoading && query.length >= 2 && !isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-3 text-sm text-muted-foreground shadow-lg">
          Suche...
        </div>
      )}
    </div>
  )
}
