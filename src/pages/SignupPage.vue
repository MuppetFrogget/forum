<script setup lang="ts">
import { ValidationRule, Notify } from 'quasar';
import { User } from 'src/components/models';
import { useUserStore } from 'src/stores/user-store';
import { ref } from 'vue';

const userStore = useUserStore();

const username = ref(null);
const email = ref(null);
const password = ref(null);
const isShown = ref(false);
const agreement = ref(false);
const isChecked = ref(true);

const isRequired = (val: string) => !!val || 'Field is required';
const emailRules: ValidationRule[] = [
  isRequired,
  (val: string, rules) => rules.email(val) || 'Provide a valide email address',
];
const passwordRules: ValidationRule[] = [
  isRequired,
  (val: string) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/g.test(val) ||
    'At least 10 characters and must contain lowercase and uppercase letters with special symbols ',
];

function createUser() {
  const userList = localStorage.getItem('users');
  if (!userList) {
    localStorage.setItem(
      'users',
      JSON.stringify([{ username: username.value, email: email.value, password: password.value }])
    );

    return {
      success: true,
      user: { username: username.value, email: email.value, password: password.value },
      message: 'Successful registration',
    };
  }

  const users: User[] = JSON.parse(userList);
  const user = users.find((user) => user.email === email.value);
  if (user) {
    return { success: false, message: 'Пользователь уже существует' };
  }

  localStorage.setItem(
    'users',
    JSON.stringify([
      ...users,
      { username: username.value, email: email.value, password: password.value },
    ])
  );

  return {
    success: true,
    user: { username: username.value, email: email.value, password: password.value },
    message: 'Successful registration',
  };
}

function onSubmit() {
  if (!agreement.value) {
    isChecked.value = false;

    return Notify.create({ type: 'negative', message: 'Accept agreement first' });
  }

  const { success, user, message } = createUser();
  if (!success) {
    return Notify.create({ type: 'negative', message });
  }

  userStore.login();
  userStore.currentUser = user;

  return Notify.create({ type: 'positive', message });
}

function onReset() {
  username.value = null;
  email.value = null;
  password.value = null;
  agreement.value = false;
}
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" :style="$q.screen.gt.sm ? 'width: 600px' : 'width: 300px'">
      <q-form class="q-gutter-md" greedy @submit="onSubmit" @reset="onReset">
        <div class="text-h2">Регистрация</div>

        <q-input
          v-model="username"
          outlined
          label="Никнэйм *"
          hint="Имя, которое будут видеть другие пользователи"
          hide-bottom-space
          no-error-icon
          lazy-rules
          :rules="[isRequired]"
        />

        <q-input
          v-model="email"
          outlined
          type="email"
          label="Email *"
          autocomplete="off"
          hide-bottom-space
          no-error-icon
          lazy-rules
          :rules="emailRules"
        />

        <q-input
          v-model="password"
          outlined
          :type="isShown ? 'text' : 'password'"
          label="Пароль *"
          autocomplete="off"
          hide-bottom-space
          no-error-icon
          lazy-rules
          :rules="passwordRules"
        >
          <template #append>
            <q-icon
              class="cursor-pointer"
              :name="isShown ? 'visibility_off' : 'visibility'"
              @click="isShown = !isShown"
            />
          </template>
        </q-input>

        <q-field
          v-model="agreement"
          borderless
          hide-bottom-space
          lazy-rules
          :rules="[(val) => !!val || 'Please accept agreement.']"
        >
          <q-checkbox v-model="agreement" label="Я прочитал правила регистрации" class="" />
        </q-field>

        <div class="row">
          <q-btn class="col-8" color="primary" label="Подтвердить" type="submit" />

          <q-btn class="col-4" flat color="primary" label="сбросить" type="reset" />
        </div>

        <div class="row items-center justify-center">
          <div class="text-caption">Есть аккаунт?</div>
          <router-link class="q-px-sm text-primary" :to="{ name: 'sign in' }">
            Войдите
          </router-link>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
