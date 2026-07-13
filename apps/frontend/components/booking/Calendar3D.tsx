'use client';

import React, { useState } from 'react';
import useBookingStore from '../../stores/bookingStore';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const Calendar3D: React.FC = () => {
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot);
  const setDate = useBookingStore((state) => state.setDate);
  const setTimeSlot = useBookingStore((state) => state.setTimeSlot);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slotAvailability, setSlotAvailability] = useState<{ [key: string]: boolean }>({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  React.useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const res = await fetch(`/api/bookings/slots?date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          const availabilityMap: { [key: string]: boolean } = {};
          data.slots.forEach((s: any) => {
            availabilityMap[s.slot] = s.available;
          });
          setSlotAvailability(availabilityMap);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
  ];

  // Helper functions to generate days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setDate(newDate);
    // Clear slot when date changes to force re-selection
    setTimeSlot(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Calendar Column */}
      <div className="lg:col-span-7 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg bg-zinc-950/80 border border-white/5 hover:bg-zinc-850 hover:text-rose-400 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg bg-zinc-950/80 border border-white/5 hover:bg-zinc-850 hover:text-rose-400 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty placeholders for offset start */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const tempDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isToday =
              new Date().toDateString() === tempDate.toDateString();
            const isPast =
              tempDate.getTime() < new Date().setHours(0, 0, 0, 0);
            
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentMonth.getMonth() &&
              selectedDate.getFullYear() === currentMonth.getFullYear();

            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => handleDateClick(day)}
                className={`aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 scale-105 border border-rose-500'
                    : isToday
                    ? 'border border-rose-500/30 text-rose-400 hover:bg-white/5'
                    : isPast
                    ? 'text-zinc-700 cursor-not-allowed opacity-40'
                    : 'text-zinc-300 bg-zinc-950/20 border border-white/5 hover:bg-white/5'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker Column */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md h-full flex flex-col">
          <h3 className="font-bold text-lg text-zinc-100 flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-violet-400" />
            Available Slots
          </h3>

          {!selectedDate ? (
            <div className="flex-1 flex items-center justify-center text-center text-zinc-500 text-sm">
              Please select an appointment date from the calendar first.
            </div>
          ) : loadingSlots ? (
            <div className="flex-1 flex items-center justify-center text-center text-zinc-500 text-sm">
              <span className="w-5 h-5 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mr-2 inline-block" />
              Checking availability...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                const isAvailable = slotAvailability[slot] !== false;
                return (
                  <button
                    key={slot}
                    disabled={!isAvailable}
                    onClick={() => setTimeSlot(slot)}
                    className={`px-4 py-3.5 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/10'
                        : !isAvailable
                        ? 'bg-zinc-950/20 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-40'
                        : 'bg-zinc-950/40 text-zinc-400 border-white/5 hover:text-zinc-200 hover:border-white/10 cursor-pointer'
                    }`}
                  >
                    <span>{slot}</span>
                    {!isAvailable && (
                      <span className="text-[9px] text-rose-500 font-bold uppercase mt-0.5 tracking-wider">
                        Full
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar3D;
