import React, { useState } from 'react';

interface CorkInputProps {
  onAddCorks: (count: number) => void;
}

const CorkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M5.25 2.25A2.25 2.25 0 0 0 3 4.5v15A2.25 2.25 0 0 0 5.25 21.75h13.5A2.25 2.25 0 0 0 21 19.5v-15A2.25 2.25 0 0 0 18.75 2.25H5.25Zm12.083 4.14a.75.75 0 0 1 .417 1.323l-3.333 1.667a.75.75 0 0 1-.834 0l-3.333-1.667a.75.75 0 0 1 .417-1.323l3.333 1.667 3.333-1.667Z" />
    </svg>
);


const CorkInput: React.FC<CorkInputProps> = ({ onAddCorks }) => {
  const [count, setCount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof count === 'number' && count > 0) {
      onAddCorks(count);
      setCount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="cork-input" className="font-semibold text-slate-700">
        Wieviele Weinkorken hast du gesammelt?
      </label>
      <input
        id="cork-input"
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
        min="1"
        placeholder="z.B. 5"
        className="w-full p-3 text-lg bg-white border-2 border-slate-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder-slate-400"
      />
      <button
        type="submit"
        disabled={!count || count <= 0}
        className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-md transform hover:scale-105 transition duration-300"
      >
        <CorkIcon />
        Hinzufügen
      </button>
    </form>
  );
};

export default CorkInput;