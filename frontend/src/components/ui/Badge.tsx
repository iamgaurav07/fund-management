// Badge Component
interface BadgeProps {
  variant: 'blue' | 'green' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge = ({ variant, size = 'md', children }: BadgeProps) => {
  const variantStyles = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};