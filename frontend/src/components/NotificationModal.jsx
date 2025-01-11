import React from 'react';

const NotificationModal = ({ message, type, onClose }) => {
  const getModalStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className={`border-l-4 p-4 ${getModalStyle()} rounded-md shadow-lg`}>
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button className="ml-4" onClick={onClose}>
            ✖️
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
