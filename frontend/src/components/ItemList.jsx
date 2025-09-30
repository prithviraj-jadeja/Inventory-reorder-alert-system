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


  return (
    <div className="container">
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
                </td>
                <td>{it.quantity}</td>
                <td>{it.reorderLevel}</td>
                <td>{it.unit}</td>
                <td>{it.supplier}</td>
                <td>
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
