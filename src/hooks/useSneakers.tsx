import { useState, useEffect } from 'react';
import { Sneaker, SneakerFormData, DashboardStats } from '@/types/sneaker';
import { useAuth } from '@/contexts/AuthContext';

// Storage key for user-specific sneaker data
const getStorageKey = (userId: string) => `sneaker_inventory_${userId}`;

// Sample data for new users
const getSampleSneakers = (): Sneaker[] => [
  {
    id: '1',
    name: 'Air Max 90',
    price: 12999,
    quantity: 50,
    category: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Jordan 1 Retro',
    price: 24999,
    quantity: 30,
    category: 'Basketball',
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Yeezy Boost 350',
    price: 29999,
    quantity: 5, // Low stock
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Converse All Star',
    price: 4499,
    quantity: 100,
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Puma RS-X',
    price: 9999,
    quantity: 40,
    category: 'Running',
    image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=400&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions for localStorage
const saveSneakers = (userId: string, sneakers: Sneaker[]) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(sneakers));
};

const getSneakers = (userId: string): Sneaker[] => {
  const sneakersData = localStorage.getItem(getStorageKey(userId));
  if (sneakersData) {
    return JSON.parse(sneakersData);
  }
  // Return sample data for new users
  const sampleSneakers = getSampleSneakers();
  saveSneakers(userId, sampleSneakers);
  return sampleSneakers;
};

export const useSneakers = () => {
  const { user } = useAuth();
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user-specific sneakers on mount and when user changes
  useEffect(() => {
    if (user) {
      const userSneakers = getSneakers(user.id);
      setSneakers(userSneakers);
    } else {
      setSneakers([]);
    }
  }, [user]);

  const addSneaker = async (data: SneakerFormData): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const newSneaker: Sneaker = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const updatedSneakers = [...sneakers, newSneaker];
      setSneakers(updatedSneakers);
      saveSneakers(user.id, updatedSneakers);
    } finally {
      setLoading(false);
    }
  };

  const updateSneaker = async (id: string, data: Partial<SneakerFormData>): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedSneakers = sneakers.map(sneaker =>
        sneaker.id === id
          ? { ...sneaker, ...data, updatedAt: new Date() }
          : sneaker
      );
      setSneakers(updatedSneakers);
      saveSneakers(user.id, updatedSneakers);
    } finally {
      setLoading(false);
    }
  };

  const deleteSneaker = async (id: string): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedSneakers = sneakers.filter(sneaker => sneaker.id !== id);
      setSneakers(updatedSneakers);
      saveSneakers(user.id, updatedSneakers);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const totalProducts = sneakers.length;
    const totalStock = sneakers.reduce((sum, sneaker) => sum + sneaker.quantity, 0);
    const totalValue = sneakers.reduce((sum, sneaker) => sum + (sneaker.price * sneaker.quantity), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalStock : 0;
    const lowStockCount = sneakers.filter(sneaker => sneaker.quantity <= 10).length;

    return {
      totalProducts,
      totalStock,
      totalValue,
      averagePrice,
      lowStockCount
    };
  };

  return {
    sneakers,
    loading,
    addSneaker,
    updateSneaker,
    deleteSneaker,
    getDashboardStats
  };
};