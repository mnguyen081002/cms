interface TabSwitchProps {
  tabs: {
    id: string;
    label: string;
  }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  disabled?: boolean;
}

/**
 * Tab Switch Component
 * 
 * A styled tab switcher with a sliding indicator, similar to GitHub's Preview/Code/Blame tabs.
 * Perfect for toggling between Edit and Preview modes.
 */
export function TabSwitch({ tabs, activeTab, onChange, disabled = false }: TabSwitchProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <div className="relative flex gap-1">
        {/* Sliding background indicator */}
        <div
          className="absolute inset-y-0 my-1 rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out"
          style={{
            left: `${activeIndex * (100 / tabs.length)}%`,
            width: `calc(${100 / tabs.length}% - 0.25rem)`,
            marginLeft: '0.125rem',
          }}
        />
        
        {/* Tab buttons */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => !disabled && onChange(tab.id)}
            disabled={disabled}
            className={`relative z-10 flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
