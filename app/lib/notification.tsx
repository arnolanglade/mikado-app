import { toast } from 'react-toastify';

export type UseNotification = {
  success: (message: string) => void
  error: (message: string) => void
};

export type UseNotificationHook = () => UseNotification;

export function useNotification(): UseNotification {
  const success = (message: string) => {
    toast.success(message);
  };
  const error = (message: string) => {
    toast.error(message);
  };

  return {
    success,
    error,
  };
}
