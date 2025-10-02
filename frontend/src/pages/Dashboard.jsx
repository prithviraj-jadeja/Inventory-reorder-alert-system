import useAlerts from '../components/useAlerts';
import AlertModal from '../components/Alert';
import Calendar from '../components/Calendar';

export default function Dashboard() {
  const low = useAlerts(true);
  const close = () => {
    const el = document.querySelector('.modal-backdrop');
    if (el) el.remove();
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className='text-3xl font-bold mb-4'>Dashboard</h2>
      <h2 className='text-xl font-bold mb-6'>Welcome! Manage your inventory and keep an eye on low stock items.</h2>
      <AlertModal items={low} onClose={close} />
      
      <div className="mt-8">
        <Calendar />
      </div>
    </div>
  );
}