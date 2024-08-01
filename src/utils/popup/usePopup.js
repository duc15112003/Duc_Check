import { useState, useEffect } from 'react';

const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success'); // Loại mặc định

  const showPopup = (message, type = 'success') => {
    setMessage(message);
    setType(type);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closePopup();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return { isOpen, message, type, showPopup, closePopup };
};

export default usePopup;
