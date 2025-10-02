import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ItemList = ({ items, setItems, setEditingItem, pagination, onPageChange }) => {
  const { user } = useAuth();

  const handleDelete = async (itemId) => {
    try {
      await axiosInstance.delete(`/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      alert('Failed to delete Item.');
    }
  };

  // return (
  //   <div>
  //     {items.map((item) => (
  //       <div key={item._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
  //         <h2 className="font-bold">{item.name}</h2>
  //         <p className="text-sm text-gray-500">Quantity: {item.quantity} {item.unit}</p>
  //         <p className="text-sm text-gray-500">Reorder Level: {item.reorderLevel} {item.unit}</p>
  //         <p className="text-sm text-gray-500">Supplier: {item.supplier}</p>
  //         <div className="mt-2">
  //           <button
  //             onClick={() => setEditingItem(item)}
  //             className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
  //           >
  //             Edit
  //           </button>
  //           <button
  //             onClick={() => handleDelete(item._id)}
  //             className="bg-red-500 text-white px-4 py-2 rounded"
  //           >
  //             Delete
  //           </button>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );

  return (
    <div className="container">
      
      {/* <div className="card" style={{ marginBottom: '1rem' }}>
        <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '.5rem' }}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setEditingItem({ ...form, name: e.target.value })} />
          <input className="input" type="number" placeholder="Qty" value={form.quantity} onChange={(e) => setEditingItem({ ...form, quantity: e.target.value })} />
          <input className="input" type="number" placeholder="Reorder" value={form.reorderLevel} onChange={(e) => setEditingItem({ ...form, reorderLevel: e.target.value })} />
          <input className="input" placeholder="Unit" value={form.unit} onChange={(e) => setEditingItem({ ...form, unit: e.target.value })} />
          <input className="input" placeholder="Supplier" value={form.supplier} onChange={(e) => setEditingItem({ ...form, supplier: e.target.value })} />
          <button className="btn" style={{ gridColumn: 'span 6' }}>Add Item</button>
        </form>
      </div> */}

      <div className="card bg-white p-6 shadow-md rounded mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-2xl font-bold'>Inventory</h2>
          {pagination && (
            <div className="text-sm text-gray-600">
              Showing {items.length} of {pagination.totalItems} items
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item) => {
                const isLowStock = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item._id} className={isLowStock ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {isLowStock && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            LOW STOCK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reorderLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.leadTime ? `${item.leadTime} days` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{item.supplier?.name || 'N/A'}</div>
                        {item.supplier?.contactInfo && (
                          <div className="text-xs text-gray-500">{item.supplier.contactInfo}</div>
                        )}
                        {item.supplier?.leadTime && (
                          <div className="text-xs text-gray-500">Supplier lead time: {item.supplier.leadTime} days</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isLowStock 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
