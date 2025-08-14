import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ItemList = ({ items, setItems, setEditingItem }) => {
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
        <h2 className='text-2xl font-bold mb-4'>Inventory</h2>
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr style={{textAlign:'left'}}>
              <th>Name</th><th>Qty</th><th>Reorder</th><th>Unit</th><th>Supplier</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td>
                  {it.name}
                  {/* {lowIds.has(it._id) && <span className="badge low" style={{ marginLeft: '.5rem' }}>LOW</span>} */}
                </td>
                <td>{it.quantity}</td>
                <td>{it.reorderLevel}</td>
                <td>{it.unit}</td>
                <td>{it.supplier}</td>
                <td>
                  {/* <button className="btn" onClick={() => updateQty(it, +1)}>+1</button>
                  <button className="btn secondary" onClick={() => updateQty(it, -1)} style={{ marginLeft: '.5rem' }}>-1</button> */}
                  <button className="btn secondary" onClick={() => setEditingItem(it)} style={{ padding:'0.3rem', background: '#96a7ddff' }}>Edit</button>
                  <button className="btn secondary" onClick={() => handleDelete(it._id)} style={{ marginLeft: '.5rem',padding:'0.3rem', background: '#dd9696ff' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;
