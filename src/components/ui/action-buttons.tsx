'use client';

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  className?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  className = 'flex space-x-2'
}: ActionButtonsProps) {
  return (
    <div className={className}>
      {showEdit && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {showDelete && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}