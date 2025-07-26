import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';
import type { Product } from '@shared/schema';

interface SmartSearchProps {
  onProductSelect: (product: Product) => void;
  className?: string;
}

export default function SmartSearch({ onProductSelect, className }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Search API call with YouTube-like algorithm
  const { data: searchResults = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/search', { q: query }],
    enabled: query.length > 2,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Popular search terms (mock data for demo)
  const popularSearches = [
    { term: language === 'bn' ? 'ভালোবাসার মগ' : 'love mug', count: 234 },
    { term: language === 'bn' ? 'ম্যাজিক মগ' : 'magic mug', count: 189 },
    { term: language === 'bn' ? 'কাপল টি-শার্ট' : 'couple tshirt', count: 156 },
    { term: language === 'bn' ? 'কাস্টম ডিজাইন' : 'custom design', count: 134 },
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            onProductSelect(searchResults[selectedIndex]);
            setIsOpen(false);
            setQuery('');
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults, onProductSelect]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // Navigate to products page with search
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={language === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...'}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(query.length > 0 || true)}
          className="pl-10 pr-10 py-3 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 dark:border-purple-700"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg border-0 bg-white/95 backdrop-blur-sm z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Popular Searches (shown when no query) */}
            {query.length === 0 && (
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'জনপ্রিয় অনুসন্ধান' : 'Popular Searches'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearchSubmit(search.term)}
                      className="justify-start text-left p-2 h-auto"
                    >
                      <div>
                        <div className="font-medium">{search.term}</div>
                        <div className="text-xs text-gray-500">
                          {search.count} {language === 'bn' ? 'অনুসন্ধান' : 'searches'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query.length > 2 && (
              <div>
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    {language === 'bn' ? 'খুঁজছি...' : 'Searching...'}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onProductSelect(product);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                          selectedIndex === index ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                        }`}
                      >
                        <img 
                          src={product.image || '/api/placeholder/300/300'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {language === 'bn' ? product.nameBn : product.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {language === 'bn' ? product.descriptionBn : product.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-purple-600">৳{product.price}</span>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {language === 'bn' ? 'কোন ফলাফল পাওয়া যায়নি' : 'No results found'}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}