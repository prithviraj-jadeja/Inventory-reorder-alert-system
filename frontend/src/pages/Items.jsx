import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import FilterComponent from '../components/FilterComponent';
import { useAuth } from '../context/AuthContext';

const Items = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({});

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token && !user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchItems = async (page = 1, filterParams = {}) => {
    if (!user || !user.token) {
      return; // Don't fetch if user is not authenticated
    }
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filterParams
      });

      const response = await axiosInstance.get(`/api/items?${queryParams}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("response: ",response)
      setItems(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items when component mounts or filters change
  useEffect(() => {
    if (user && user.token) {
      fetchItems(1, filters);
    }
  }, [user]); // Remove filters dependency to prevent infinite loop

  // Item handlers
  const handleItemAdd = (newItem) => {
    setItems(prevItems => [newItem, ...prevItems]);
    fetchItems(1, filters); // Refresh the list after adding
  };

  const handleItemUpdate = (updatedItem) => {
    setItems(prevItems => prevItems.map(item => 
      item._id === updatedItem._id ? updatedItem : item
    ));
  };

  console.log("Items: ",items)

  const handleItemDelete = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchItems(1, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    fetchItems(1, {});
  };

  const handlePageChange = (page) => {
    fetchItems(page, filters);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage your inventory items with advanced filtering and sorting capabilities.</p>
      </div>

      <ItemForm
        items={items}
        setItems={setItems}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onItemAdd={handleItemAdd}
      />

      {user && (
        <FilterComponent
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading items...</span>
        </div>
      ) : (
        <ItemList 
          items={items} 
          setItems={handleItemDelete}
          setEditingItem={setEditingItem}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Items;
