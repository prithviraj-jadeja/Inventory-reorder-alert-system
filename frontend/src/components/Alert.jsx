

export default function AlertModal({ items, onClose, onView }) {
  if (!items?.length) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Low Stock Alerts</h3>
        <p>The following items are at or below their reorder level:</p>
        <ul>
          {items.map((it) => (
            <li key={it._id}>
              <strong>{it.name}</strong> (SKU: {it.sku}) — Qty {it.quantity} / Reorder {it.reorderLevel}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
          <button className="btn secondary" onClick={onClose}>Dismiss</button>
          <button className="btn" onClick={onView}>View Inventory</button>
        </div>
      </div>
    </div>
  );
}