import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notify {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
  timeout?: number;
}

export const useNotifyStore = defineStore('notify', () => {
  const notifications = ref<Notify[]>([]);

  function addNotify(message: string, type: Notify['type'] = 'info', duration = 4000) {
    const id = crypto.randomUUID();

    notifications.value.push({ id, message, type });
    setTimeout(() => {
      removeNotify(id);
    }, duration);
  }

  function removeNotify(id: string) {
    notifications.value = notifications.value.filter(t => t.id !== id);
  }

  return { notifications, addNotify, removeNotify };
});