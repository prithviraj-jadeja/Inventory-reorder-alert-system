export default function AlertModal({ items, onClose, onView }) {
  if (!items?.length) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal card bg-gray-100 p-6 shadow-md rounded ml-5">
        <h3 className='text-xl font-bold mb-3' style={{color:'red'}}>Low Stock Alerts</h3>
        <p className='text-xl mb-3'> The following items are at or below their reorder level: </p>
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr style={{textAlign:'left'}}>
              <th>Name</th><th>Current Quantity</th><th>Reorder Level</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr>
                <td>{it.name}</td>
                <td>{it.quantity}</td>
                <td>{it.reorderLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}