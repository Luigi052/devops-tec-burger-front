import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-8 text-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
          <Icon className="w-8 h-8 text-brown-200" />
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brown-500">{title}</h3>
        <p className="text-sm text-brown-300 max-w-md">{message}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
