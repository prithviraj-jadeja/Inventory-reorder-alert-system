import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ItemForm = ({ items, setItems, editingItem, setEditingItem }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', quantity: '', reorderLevel: '', unit: '', supplier: '' });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        quantity: editingItem.quantity,
        reorderLevel: editingItem.reorderLevel,
        unit: editingItem.unit,
        supplier: editingItem.supplier,
      });
    } else {
      setFormData({ name: '', quantity: '', reorderLevel: '', unit: '', supplier: '' });
    }
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data for submission
      const submissionData = {
        ...formData,
        leadTime: parseInt(formData.leadTime) || 7,
        supplier: {
          name: formData.supplier.name
        }
      };
      let response;
      if (editingItem) {
         response = await axiosInstance.put(`/api/items/${editingItem._id}`, submissionData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(items.map((item) => (item._id === response.data._id ? response.data : item)));
      } else {
         response = await axiosInstance.post('/api/items', submissionData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems([...items, response.data]);
      }
      setEditingItem(null);
      setFormData({ name: '', quantity: '', reorderLevel: '', unit: '', supplier: '' });
    } catch (error) {
      console.log("error", error)
      alert('Failed to save item.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add Item'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="ReorderLevel"
        value={formData.reorderLevel}
        onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Unit"
        value={formData.unit}
        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Supplier"
        value={formData.supplier}
        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-gray-600 text-white p-2 rounded">
        {editingItem ? 'Update Item' : 'Add Item'}
      </button>
    </form>
  );
};

export default ItemForm;
