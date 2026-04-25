import React from 'react';
import { Search } from 'lucide-react';
import './uiverse.css';

export function SearchInput({ placeholder = "Search...", value, onChange }: { placeholder?: string, value?: string, onChange?: (e: any) => void }) {
  return (
    <div className="input-glow-wrapper relative" id="main">
      <div id="search-icon">
        <Search size={20} className="text-white" />
      </div>
      <div id="poda">
        <div className="glow"></div>
        <div className="darkBorderBg"></div>
        <div className="darkBorderBg"></div>
        <div className="darkBorderBg"></div>
        <div className="white"></div>
        <div className="border"></div>
        <div id="filter-icon">
          <svg
            preserveAspectRatio="none"
            height="27"
            width="27"
            viewBox="4.8 4.32 15.36 15.36"
            fill="none"
          >
            <path
              d="M20.16,6.24H4.8v2.88l6.24,5.28v4.8l3.84-1.92v-2.88l6.24-5.28V6.24z"
              fill="#fff"
            ></path>
          </svg>
        </div>
        <div className="filterBorder"></div>
        <input
          placeholder={placeholder}
          type="text"
          name="text"
          className="input"
          value={value}
          onChange={onChange}
        />
        <div id="input-mask"></div>
        <div id="pink-mask"></div>
      </div>
    </div>
  );
}
