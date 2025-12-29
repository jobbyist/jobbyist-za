import { useState } from 'react';

interface CompanyLogoProps {
  logoUrl?: string | null;
  companyName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-32 h-32 text-5xl',
};

const colorClasses = [
  'bg-black',
  'bg-neutral-700',
  'bg-neutral-600',
  'bg-neutral-800',
  'bg-neutral-500',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-red-600',
];

const CompanyLogo = ({ logoUrl, companyName, size = 'md', className = '' }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClass = sizeClasses[size];
  const colorIndex = companyName.charCodeAt(0) % colorClasses.length;
  const bgColor = colorClasses[colorIndex];

  if (!logoUrl || imageError) {
    return (
      <div 
        className={`${sizeClass} ${bgColor} rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform ${className}`}
      >
        {companyName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={companyName}
      className={`${sizeClass} rounded-lg object-cover bg-white border group-hover:scale-110 transition-transform ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default CompanyLogo;
