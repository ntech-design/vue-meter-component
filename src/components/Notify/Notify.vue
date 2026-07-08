<script setup lang="ts">
import { useNotifyStore } from '@/stores/useNotifyStore';

const notifyStore = useNotifyStore();
</script>

<template>
  <Teleport to="body">
    <div class="notify" role="alert" aria-live="assertive">
      <TransitionGroup name="notify-fade">
        <div v-for="notify in notifyStore.notifications" :key="notify.id" :class="['notify__item', `notify__item--${notify.type}`]">
          <p>{{ notify.message }}</p>
          <button @click="notifyStore.removeNotify(notify.id)" aria-label="Close">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.notify {
  $error: #FF4444;
  $success: #44FF44;
  $info: #44FFFF;
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__item {
    display: flex;
    font-family: var(--sans, sans-serif), sans-serif;
    color: #FFFFFF;
    background-color: var(--accent-bg, #4488FF33);
    border: 1px solid var(--accent-border, #4488FF);
    border-radius: var(--border-radius, 0.25rem);
    padding: 1rem;

    p {
      padding: 0.25rem 0;
      margin: 0;
    }
    button {
      color: var(--accent, #4488FF);
      background-color: var(--accent-bg, #4488FF33);
      border: none;
      border-radius: var(--border-radius, 0.25rem);
      font-size: var(--font-size, 1rem);
      margin-left: 1rem;
      padding: 0.25rem 0.5rem;
      line-height: 1;
    }

    &--error {
      background-color: #{$error}33;
      border-color: #{$error};
      button {
        color: #{$error};
        background-color: #{$error}33;
      }
    }

    &--success {
      background-color: #{$success}33;
      border-color: #{$success};
      button {
        color: #{$success};
        background-color: #{$success}33;
      }
    }

    &--info {
      background-color: #{$info}33;
      border-color: #{$info};
      button {
        color: #{$info};
        background-color: #{$info}33;
      }
    }
  }
}
.notify-fade-enter-active, .notify-fade-leave-active { transition: all 0.3s ease; }
.notify-fade-enter-from, .notify-fade-leave-to { opacity: 0; transform: translateX(30px); }
</style>