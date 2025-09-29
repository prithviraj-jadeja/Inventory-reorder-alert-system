import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ItemForm = ({ items, setItems, editingItem, setEditingItem }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    quantity: '0', 
    reorderLevel: '10', 
    unit: 'pcs', 
    supplier: {
      name: '',
      contactInfo: '',
      leadTime: '7'
    },
    leadTime: '7',
    category: 'General',
    cost: '0',
    description: '',
    tags: ''
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        quantity: editingItem.quantity,
        reorderLevel: editingItem.reorderLevel,
        unit: editingItem.unit,
        supplier: {
          name: editingItem.supplier?.name || '',
          contactInfo: editingItem.supplier?.contactInfo || '',
          leadTime: editingItem.supplier?.leadTime || ''
        },
        leadTime: editingItem.leadTime || '',
        category: editingItem.category || '',
        cost: editingItem.cost || '',
        description: editingItem.description || '',
        tags: editingItem.tags?.join(', ') || ''
      });
    } else {
      setFormData({ 
        name: '', 
        quantity: '', 
        reorderLevel: '', 
        unit: '', 
        supplier: {
          name: '',
          contactInfo: '',
          leadTime: ''
        },
        leadTime: '',
        category: '',
        cost: '',
        description: '',
        tags: ''
      });
    }
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data for submission
      const submissionData = {
        ...formData,
        // Ensure leadTime is always a number
        leadTime: parseInt(formData.leadTime) || 7,
        // Format supplier data properly
        supplier: {
          name: formData.supplier.name,
          contactInfo: formData.supplier.contactInfo,
          leadTime: parseInt(formData.supplier.leadTime) || 7
        }
      };

      if (editingItem) {
        const response = await axiosInstance.put(`/api/items/${editingItem._id}`, submissionData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Update the items list with the edited item
        setItems(prevItems => prevItems.map((item) => 
          item._id === response.data._id ? response.data : item
        ));
      } else {
        const response = await axiosInstance.post('/api/items', submissionData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Add the new item to the beginning of the list
        setItems(prevItems => [response.data, ...prevItems]);
      }
      
      // Reset form after successful submission
      setFormData({ 
        name: '', 
        quantity: '', 
        reorderLevel: '', 
        unit: 'pcs', 
        supplier: {
          name: '',
          contactInfo: '',
          leadTime: '7'
        },
        leadTime: '7',
        category: '',
        cost: '',
        description: '',
        tags: ''
      });

      // Trigger parent component refresh
      if (typeof onItemAdd === 'function') {
        onItemAdd(response.data);
      }
      setEditingItem(null);
      setFormData({ 
        name: '', 
        quantity: '', 
        reorderLevel: '', 
        unit: '', 
        supplier: '',
        leadTime: '',
        category: '',
        cost: '',
        description: '',
        tags: ''
      });
    } catch (error) {
      alert('Failed to save item.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add Item'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            placeholder="Item name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Tools">Tools</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <input
            type="number"
            placeholder="Current quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level *</label>
          <input
            type="number"
            placeholder="Reorder when quantity reaches"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="lbs">Pounds</option>
            <option value="liters">Liters</option>
            <option value="boxes">Boxes</option>
            <option value="units">Units</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (Days)</label>
          <input
            type="number"
            placeholder="Days to receive new stock"
            value={formData.leadTime}
            onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
          <input
            type="text"
            placeholder="Supplier name"
            value={formData.supplier.name}
            onChange={(e) => setFormData({
              ...formData,
              supplier: { ...formData.supplier, name: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact Info</label>
          <input
            type="text"
            placeholder="Supplier contact information"
            value={formData.supplier.contactInfo}
            onChange={(e) => setFormData({
              ...formData,
              supplier: { ...formData.supplier, contactInfo: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Lead Time (Days)</label>
          <input
            type="number"
            placeholder="Supplier lead time in days"
            value={formData.supplier.leadTime}
            onChange={(e) => setFormData({
              ...formData,
              supplier: { ...formData.supplier, leadTime: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost (per unit)</label>
          <input
            type="number"
            placeholder="Cost per unit"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          placeholder="Item description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          type="text"
          placeholder="Enter tags separated by commas"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
      </div>

      <div className="mt-6 flex space-x-3">
        <button 
          type="submit" 
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {editingItem ? 'Update Item' : 'Add Item'}
        </button>
        {editingItem && (
          <button 
            type="button"
            onClick={() => setEditingItem(null)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ItemForm;
