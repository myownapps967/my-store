import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="smartphone-wrapper" className="relative mx-auto max-w-[400px] w-full aspect-[9/19.2] bg-neutral-900 rounded-[55px] p-3.5 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50 flex flex-col justify-between overflow-hidden select-none">
      {/* Speaker and Camera Notch (Dynamic Island styled) */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3.5 shadow-inner">
        <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full border border-neutral-800 flex items-center justify-center">
          <div className="w-1 h-1 bg-blue-900 rounded-full"></div>
        </div>
        <div className="w-12 h-1 bg-neutral-800 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></div>
      </div>

      {/* Left side side buttons */}
      <div className="absolute -left-1.5 top-24 w-1.5 h-12 bg-neutral-800 rounded-l border-y border-l border-neutral-700"></div>
      <div className="absolute -left-1.5 top-40 w-1.5 h-10 bg-neutral-800 rounded-l border-y border-l border-neutral-700"></div>
      <div className="absolute -left-1.5 top-52 w-1.5 h-10 bg-neutral-800 rounded-l border-y border-l border-neutral-700"></div>

      {/* Right side power button */}
      <div className="absolute -right-1.5 top-32 w-1.5 h-14 bg-neutral-800 rounded-r border-y border-r border-neutral-700"></div>

      {/* Internal Screen Container */}
      <div className="w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col relative border border-black/10 shadow-inner">
        
        {/* Device Status Bar */}
        <div className="w-full h-11 pt-3.5 px-6 flex justify-between items-center bg-transparent text-black dark:text-white z-40 text-xs font-semibold select-none">
          <span className="text-[11px] font-bold tracking-tight">{time || '09:41 AM'}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={12} strokeWidth={2.5} />
            <Wifi size={12} strokeWidth={2.5} />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] mr-0.5">94%</span>
              <Battery size={14} className="rotate-0 text-current" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Dynamic content rendering inside */}
        <div className="flex-1 w-full overflow-hidden flex flex-col relative">
          {children}
        </div>

        {/* iOS Home Indicator Bar at bottom */}
        <div className="w-full h-6 flex items-center justify-center bg-transparent z-40 select-none pb-1">
          <div className="w-32 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
