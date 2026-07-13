'use client';

import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Card3D from '../ui/Card3D';
import Button3D from '../ui/Button3D';
import Spinner3D from '../ui/Spinner3D';
import { Search, Clock, DollarSign, Filter } from 'lucide-react';
import useNotificationStore from '../../stores/notificationStore';
import useBookingStore, { Service } from '../../stores/bookingStore';

export const ServiceSelector: React.FC = () => {
  const { token } = useAuth();
  const setService = useBookingStore((state) => state.setService);
  const selectedService = useBookingStore((state) => state.selectedService);
  const addToast = useNotificationStore((state) => state.addToast);
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Hair', 'Skin', 'Nails', 'Massage'];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || '/api'}/services?${queryParams.toString()}`
        );
        const data = await res.json();
        if (res.ok) {
          setServices(data.services);
        } else {
          addToast('Could not fetch services list', 'error');
        }
      } catch (err) {
        console.error('Fetch services error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce/delay fetch on search
    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category, search, addToast]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-950/60 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-3 rounded-xl border border-white/5 outline-none focus:border-rose-500/50 text-sm transition-all"
          />
        </div>

        {/* Categories toggler */}
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                category === cat
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/10'
                  : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="min-h-[25vh] flex items-center justify-center">
          <Spinner3D />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No services match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isSelected = selectedService?.id === service.id;
            return (
              <Card3D
                key={service.id}
                glowColor={isSelected ? 'rgba(255, 51, 102, 0.25)' : 'rgba(255, 255, 255, 0.03)'}
                className={`flex flex-col h-full border ${
                  isSelected ? 'border-rose-500/40 bg-zinc-900/60' : 'border-white/5'
                }`}
              >
                {service.imageUrl && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-rose-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5">
                      {service.category}
                    </span>
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-zinc-100 mb-1.5">{service.name}</h3>
                <p className="text-zinc-400 text-sm flex-grow line-clamp-3 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
                      <Clock className="w-4 h-4 text-rose-400" />
                      {service.duration} mins
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-200 text-sm font-bold">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      {service.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <Button3D
                    onClick={() => setService(service)}
                    variant={isSelected ? 'accent' : 'primary'}
                    className="py-2 px-4 text-xs font-bold"
                  >
                    {isSelected ? 'Selected' : 'Select Service'}
                  </Button3D>
                </div>
              </Card3D>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
