import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const FilterComponent = ({ onFilterChange, onClearFilters }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    minQuantity: '',
    maxQuantity: '',
    lowStock: false,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  // Removed supplier dropdown logic

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      minQuantity: '',
      maxQuantity: '',
      lowStock: false,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="bg-white p-6 shadow-md rounded mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter & Search</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Items
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quantity Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Quantity
            </label>
            <input
              type="number"
              placeholder="Min quantity"
              value={filters.minQuantity}
              onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Quantity
            </label>
            <input
              type="number"
              placeholder="Max quantity"
              value={filters.maxQuantity}
              onChange={(e) => handleFilterChange('maxQuantity', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="quantity">Quantity</option>
              <option value="reorderLevel">Reorder Level</option>
              <option value="leadTime">Lead Time</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Low Stock Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowStock"
            checked={filters.lowStock}
            onChange={(e) => handleFilterChange('lowStock', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="lowStock" className="ml-2 block text-sm text-gray-700">
            Show only low stock items
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterComponent;
