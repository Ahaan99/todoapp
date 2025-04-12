import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiSearch, FiFilter } from 'react-icons/fi';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' }
];

const FilterBar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, dateFilter, setDateFilter }) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-white/60" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-white/50 focus:border-slate-500"
          />
        </div>
        
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2 hover:bg-slate-600/50"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setDateFilter('');
            }}
            className="text-white hover:text-white/80 hover:bg-slate-700/50"
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;
