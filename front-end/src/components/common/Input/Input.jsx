import React from 'react';
import clsx from 'clsx';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  name,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;