import React, { useState, useRef } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Airport } from '../hooks/useAirports';

interface StaticAirportSelectorProps {
    placeholder: string;
    selectedAirport: Airport | null;
    onSelect: (airport: Airport) => void;
    className?: string;
}

export const StaticAirportSelector: React.FC<StaticAirportSelectorProps> = ({
    placeholder,
    selectedAirport,
    onSelect,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [airports, setAirports] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const API_BASE = 'http://localhost:3001/api';

    // SIMPLE cache
    const cache = useRef(new Map<string, Airport[]>());

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch airports ONLY when user types or clicks
    const fetchAirports = async (query?: string) => {
        const cacheKey = query ? `search:${query}` : 'indonesia';

        // Return cached data if available
        if (cache.current.has(cacheKey)) {
            setAirports(cache.current.get(cacheKey) || []);
            return;
        }

        setIsLoading(true);
        try {
            const url = query
                ? `${API_BASE}/destinations/csv/search?query=${encodeURIComponent(query)}`
                : `${API_BASE}/destinations/csv/indonesia`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                const results = Array.isArray(data.data) ? data.data : [];
                const limitedResults = query ? results : results.slice(0, 10);

                cache.current.set(cacheKey, limitedResults);
                setAirports(limitedResults);
            } else {
                console.error('Fetch failed:', data.message);
                setAirports([]);
            }
        } catch (err) {
            console.error('Error fetching airports:', err);
            setAirports([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        if (airports.length === 0 && !searchQuery) {
            fetchAirports(); // Load Indonesian airports only when user focuses
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsOpen(true);

        // Debounced search
        setTimeout(() => {
            if (query.trim()) {
                fetchAirports(query);
            } else {
                fetchAirports(); // Load Indonesian airports
            }
        }, 300);
    };

    const handleAirportSelect = (airport: Airport) => {
        onSelect(airport);
        setIsOpen(false);
        setSearchQuery('');
        inputRef.current?.blur();
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div className="flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={selectedAirport ? selectedAirport.airport : placeholder}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    className="w-full bg-transparent outline-none text-sm"
                    autoComplete="off"
                />
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
                    {isLoading ? (
                        <div className="p-3 text-center text-slate-500 text-sm">
                            Loading airports...
                        </div>
                    ) : airports.length > 0 ? (
                        airports.map((airport, index) => (
                            <button
                                key={`${airport.code}-${index}`}
                                onClick={() => handleAirportSelect(airport)}
                                className="w-full px-3 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-slate-900 truncate">
                                            {airport.airport}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {airport.city}, {airport.country} ({airport.code})
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : searchQuery.length > 0 ? (
                        <div className="p-3 text-center text-slate-500 text-sm">
                            No airports found for "{searchQuery}"
                        </div>
                    ) : (
                        <div className="p-3 text-center text-slate-500 text-sm">
                            Start typing to search airports...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};