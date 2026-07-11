import React from 'react';

// A simple utility to format Thai numbers
export const formatTHB = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0.00';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Component for Input Field with Number Masking
interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  value: number;
  onChangeValue: (val: number) => void;
  suffix?: string;
}

export function NumberInput({ label, helperText, error, value, onChangeValue, className, suffix = 'บาท', ...props }: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState('');

  React.useEffect(() => {
    if (value === 0 && !displayValue) {
      setDisplayValue('');
    } else {
      // keep it aligned with value but preserve trailing dots if user is typing
      if (parseFloat(displayValue.replace(/,/g, '')) !== value) {
        setDisplayValue(value ? new Intl.NumberFormat('th-TH').format(value) : '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setDisplayValue(e.target.value); // Let them type
    
    const num = parseFloat(rawValue);
    if (!isNaN(num)) {
      onChangeValue(num);
    } else {
      onChangeValue(0);
    }
  };

  const handleBlur = () => {
    if (value !== 0) {
      setDisplayValue(new Intl.NumberFormat('th-TH').format(value));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          className="flex h-11 w-full rounded-md border border-input bg-card px-4 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 text-right pr-12 font-mono"
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-sm font-medium">
          {suffix}
        </div>
      </div>
      {(helperText || error) && (
        <p className={`text-xs ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

// Simple toggle/switch
interface ToggleProps {
  label: string;
  helperText?: string;
  checked: boolean;
  onChangeChecked: (checked: boolean) => void;
}

export function SwitchToggle({ label, helperText, checked, onChangeChecked }: ToggleProps) {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card shadow-sm">
      <div className="space-y-0.5">
        <label className="text-base font-medium cursor-pointer" onClick={() => onChangeChecked(!checked)}>
          {label}
        </label>
        {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChangeChecked(!checked)}
        className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-primary' : 'bg-input'
        }`}
      >
        <span
          className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// Section Header
export function FormSection({ title, description, children, icon: Icon }: { title: string, description?: string, children: React.ReactNode, icon?: any }) {
  return (
    <div className="space-y-6 pt-8 first:pt-0">
      <div className="border-b border-border pb-4">
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-primary">
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}
