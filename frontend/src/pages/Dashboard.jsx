import { useNavigate } from 'react-router-dom';
import useAlerts from '../components/useAlerts';
import AlertModal from '../components/Alert';

export default function Dashboard() {
  const navigate = useNavigate();
  const low = useAlerts(true);
  const close = () => {
    const el = document.querySelector('.modal-backdrop');
    if (el) el.remove();
  };
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome! Manage your inventory and keep an eye on low stock items.</p>
      <AlertModal items={low} onClose={close} />
    </div>
  );
}