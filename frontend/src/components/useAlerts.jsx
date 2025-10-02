import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

export default function useAlerts(enabled = true) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!enabled) return;
    const fetchLow = async () => {
      try {
        const { data } = await axiosInstance.get('/api/items/low-stock');
        setItems(data);
      } catch {
        setItems([]);
      }
    };
    fetchLow();
  }, [enabled]);
  return items;
}