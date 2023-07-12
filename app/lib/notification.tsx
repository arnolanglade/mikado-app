export type UseNotification = {
  success: (message: string) => void
  error: (message: string) => void
};

export type UseNotificationHook = () => UseNotification;

export function useNotification(): UseNotification {
  const success = (message: string) => {
    console.info(message);
  };
  const error = (message: string) => {
    console.error(message);
  };

  return {
    success,
    error,
  };
}
