import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface DeletePlanModalProps {
  planId: string;
  planName: string;
  onClose: () => void;
  onDeleteSuccess: (planId: string) => void;
}

const DeletePlanModal: React.FC<DeletePlanModalProps> = ({ 
  planId,
  planName, 
  onClose, 
  onDeleteSuccess 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/business/plans/deleteplans/?plans=${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete plan');
      }

      toast.success(`Plan "${planName}" deleted successfully`);
      onDeleteSuccess(planId); // No changes needed here
      onClose();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error(`Failed to delete plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Delete Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete the plan "{planName}"? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlanModal;
