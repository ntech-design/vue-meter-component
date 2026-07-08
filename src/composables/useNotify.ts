import { useNotifyStore } from '@/stores/useNotifyStore';

export function useNotify() {
  const store = useNotifyStore();

  return {
    showError: (msg: string) => store.addNotify(msg, 'error'),
    showSuccess: (msg: string) => store.addNotify(msg, 'success'),
    showInfo: (msg: string) => store.addNotify(msg, 'info')
  };
}