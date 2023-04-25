<script setup lang="ts">
import { Notify } from 'quasar';
import { User } from 'src/components/models';
import { useUserStore } from 'src/stores/user-store';
import { ref } from 'vue';

const userStore = useUserStore();

const login = ref(null);
const password = ref(null);
const isShown = ref(false);
const remember = ref(true);

const isRequired = (val: string) => !!val || 'Field is required';

function signin() {
  const userList = localStorage.getItem('users');
  if (!userList) {
    return { success: false, message: 'Users not found' };
  }

  const users: User[] = JSON.parse(userList);
  const user = users.find((user) => user.email === login.value || user.username === login.value);
  if (!user || user.password !== password.value) {
    return { success: false, message: 'Неправильный пароль или такого пользователя не существует' };
  }

  return { success: true, user, message: 'Success login' };
}

function onSubmit() {
  const { success, user, message } = signin();
  if (!success) {
    return Notify.create({ type: 'negative', message });
  }

  userStore.login();
  userStore.currentUser = user;

  return Notify.create({ type: 'positive', message });
}
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" :style="$q.screen.gt.sm ? 'width: 600px' : 'width: 300px'">
      <q-form class="q-gutter-md" greedy @submit="onSubmit">
        <div class="text-h2">Войти</div>

        <q-input
          v-model="login"
          outlined
          label="Email или логин *"
          hide-bottom-space
          no-error-icon
          lazy-rules
          :rules="[isRequired]"
        />

        <q-input
          v-model="password"
          outlined
          :type="isShown ? 'text' : 'password'"
          label="Пароль *"
          hide-bottom-space
          no-error-icon
          lazy-rules
          :rules="[isRequired]"
        >
          <template #append>
            <q-icon
              class="cursor-pointer"
              :name="isShown ? 'visibility_off' : 'visibility'"
              @click="isShown = !isShown"
            />
          </template>
        </q-input>

        <q-checkbox v-model="remember" label="Запомнить меня" />

        <div>
          <q-btn class="full-width" label="Войти" type="submit" color="primary" />
        </div>

        <div class="row items-center justify-center">
          <div class="text-caption">Нет аккаунта?</div>
          <router-link class="q-px-sm text-primary" :to="{ name: 'register' }">
            Зарегистрируйтесь
          </router-link>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
