import { User } from 'components/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const isLogged = ref(false);

  function login() {
    isLogged.value = true;
  }

  function logout() {
    isLogged.value = false;
  }

  return { currentUser, isLogged, login, logout };
});
