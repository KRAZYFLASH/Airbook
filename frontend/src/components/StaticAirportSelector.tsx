import React, { useState, useRef } from 'react';
import { ChevronDown, MapPin, X } from 'lucide-react';
import { Airport } from '../hooks/useAirports';

interface StaticAirportSelectorProps {
  placeholder: string;
  selectedAirport: Airport | null;
  onSelect: (airport: Airport | null) => void;
  className?: string;
}

export const StaticAirportSelector: React.FC<StaticAirportSelectorProps> = ({
  placeholder,
  selectedAirport,
  onSelect,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(selectedAirport?.airport || "");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const API_BASE = 'http://localhost:3001/api';
  const cache = useRef(new Map<string, Airport[]>());

  // Tutup dropdown ketika klik di luar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ambil data bandara
  const fetchAirports = async (query?: string) => {
    const cacheKey = query ? `search:${query}` : 'indonesia';
    if (cache.current.has(cacheKey)) {
      setAirports(cache.current.get(cacheKey) || []);
      return;
    }

    setIsLoading(true);
    try {
      const url = query
        ? `${API_BASE}/user-airports/search?query=${encodeURIComponent(query)}`
        : `${API_BASE}/user-airports/indonesia`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        const results = Array.isArray(data.data) ? data.data : [];
        const limited = query ? results : results.slice(0, 10);
        cache.current.set(cacheKey, limited);
        setAirports(limited);
      } else {
        setAirports([]);
      }
    } catch (err) {
      console.error('Error fetching airports:', err);
      setAirports([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Saat fokus, tampilkan dropdown
  const handleFocus = () => {
    setIsOpen(true);
    if (airports.length === 0) fetchAirports();
  };

  // Saat mengetik
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    setIsOpen(true);
    const timer = setTimeout(() => {
      if (q.trim()) fetchAirports(q);
      else fetchAirports();
    }, 300);
    return () => clearTimeout(timer);
  };

  // Pilih bandara
  const handleSelect = (airport: Airport) => {
    onSelect(airport);
    setSearchQuery(airport.airport);
    setIsOpen(false);
  };

  // Hapus pilihan
  const clearSelection = () => {
    setSearchQuery("");
    onSelect(null);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          placeholder={placeholder}
          onFocus={handleFocus}
          onChange={handleChange}
          className="w-full bg-transparent outline-none text-sm"
          autoComplete="off"
        />
        {searchQuery ? (
          <button type="button" onClick={clearSelection} className="p-1 rounded hover:bg-slate-100">
            <X size={14} />
          </button>
        ) : (
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-center text-slate-500 text-sm">Loading airports...</div>
          ) : airports.length > 0 ? (
            airports.map((airport, i) => (
              <button
                key={`${airport.code}-${i}`}
                onClick={() => handleSelect(airport)}
                className="w-full px-3 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 text-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{airport.airport}</div>
                    <div className="text-xs text-slate-500">
                      {airport.city}, {airport.country} ({airport.code})
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-3 text-center text-slate-500 text-sm">
              {searchQuery.length > 0
                ? `No airports found for "${searchQuery}"`
                : 'Start typing to search airports...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
