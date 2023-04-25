<script setup lang="ts">
import { Notify } from 'quasar';
import { ref, computed } from 'vue';
import { useUserStore } from 'stores/user-store';

const userStore = useUserStore();

interface NavLink {
  route: string;
  name: string;
  label: string;
  icon?: string;
  color?: string;
  style?: boolean;
}

const navLinks: NavLink[] = [
  {
    route: '/',
    name: 'home',
    label: 'Главная',
    icon: 'home',
  },
];

const bottomList: NavLink[] = [
  {
    route: '/auth/sign-up',
    name: 'register',
    label: 'Создать аккаунт',
    color: 'primary',
  },
  {
    route: '/auth/sign-in',
    name: 'sign in',
    label: 'Войти',
    style: true,
  },
];

const userBottomList = [
  {
    label: 'Создать публикацию',
    flat: true,
    click: () => toggleDialog(),
  },
  {
    route: '/profile',
    name: 'profile',
    label: 'Профиль',
    flat: true,
  },
  {
    label: 'Выйти',
    color: 'primary',
    click: () => userStore.logout(),
  },
];

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const dialog = ref(false);
const maximizedToggle = ref(false);

function toggleDialog() {
  dialog.value = !dialog.value;
}

const title = ref(null);
const file = ref(null);
const editor = ref('');

const preview = computed(() => URL.createObjectURL(file.value));

function createPost() {
  const posts = JSON.parse(sessionStorage.getItem('posts'));
  if (!posts) {
    sessionStorage.setItem(
      'posts',
      JSON.stringify([
        {
          title: title.value,
          thumbnail: preview.value,
          content: editor.value,
          username: userStore.currentUser?.username,
          createdAt: new Date().toLocaleTimeString('ru-RU'),
        },
      ])
    );

    toggleDialog();

    return { success: true, message: 'Публикация успешно создана' };
  }

  sessionStorage.setItem(
    'posts',
    JSON.stringify([
      ...posts,
      {
        title: title.value,
        thumbnail: preview.value,
        content: editor.value,
        username: userStore.currentUser?.username,
        createdAt: new Date().toLocaleTimeString('ru-RU'),
      },
    ])
  );

  toggleDialog();

  return { success: true, message: 'Публикация успешно создана' };
}

function onSubmit() {
  const { success, message } = createPost();

  if (!success) {
    return Notify.create({ type: 'negative', message });
  }

  Notify.create({ type: 'positive', message });
  console.log('post:', { title: title.value, file: file.value, editor: editor.value });
}
</script>

<template>
  <q-layout view="hHh lpR fff">
    <q-header :class="$q.dark.isActive && 'bg-dark'" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="lt-md"
          @click="toggleLeftDrawer"
        />

        <q-separator class="lt-md" vertical inset />

        <q-toolbar-title :shrink="true" class="q-mr-md">
          <q-avatar square icon="newspaper" size="50px" />

          <q-btn
            v-if="$q.screen.gt.md"
            flat
            label="Новостной форум"
            :to="{ name: 'main', params: { type: 'all' } }"
          />
        </q-toolbar-title>

        <q-space />

        <div v-if="!userStore.isLogged" class="gt-sm q-gutter-lg">
          <q-btn
            label="Создать аккаунт"
            :to="{ name: 'register' }"
            :color="$q.dark.isActive ? 'primary' : 'grey-9'"
          />

          <q-btn flat stretch label="Войти" :to="{ name: 'sign in' }" />
        </div>

        <div v-else class="gt-sm q-gutter-lg">
          <q-btn flat stretch label="Создать пост" @click="toggleDialog" />

          <!-- <q-btn flat stretch label="Профиль" :to="{ name: 'profile' }" /> -->

          <q-btn
            label="Выйти"
            :color="$q.dark.isActive ? 'primary' : 'grey-9'"
            @click="userStore.logout()"
          />
        </div>

        <q-btn flat stretch icon="settings_brightness" class="q-ml-md" @click="$q.dark.toggle()" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="300" bordered>
      <q-list>
        <q-item-label class="row justify-end no-wrap q-pt-sm q-pb-md q-px-xs" header>
          <q-btn flat color="red" icon="close" @click="toggleLeftDrawer" />
        </q-item-label>

        <q-item
          v-for="item in navLinks"
          :key="item.label"
          v-ripple
          clickable
          exact
          :to="{ name: item.name }"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section class="text-capitalize">
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-list class="fixed-bottom">
        <div v-if="!userStore.isLogged">
          <q-item
            v-for="item in bottomList"
            :key="item.label"
            v-ripple
            clickable
            exact
            :to="{ name: item.name }"
          >
            <q-item-section>
              <q-btn :label="item.label" :color="item.color" :flat="item.flat" />
            </q-item-section>
          </q-item>
        </div>

        <div v-else>
          <q-item
            v-for="item in userBottomList"
            :key="item.label"
            v-ripple
            clickable
            exact
            :to="{ name: item.name }"
          >
            <q-item-section>
              <q-btn
                :label="item.label"
                :color="item.color"
                :flat="item.flat"
                @click="item.click"
              />
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />

      <q-dialog
        v-model="dialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card
          class=""
          :style="!maximizedToggle && 'width: 1200px; height: 800px; max-width: 80vw'"
        >
          <q-bar :class="!$q.dark.isActive && 'bg-primary text-white'">
            <q-space />

            <q-btn
              dense
              flat
              icon="minimize"
              :disable="!maximizedToggle"
              @click="maximizedToggle = false"
            >
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
            </q-btn>

            <q-btn
              dense
              flat
              icon="crop_square"
              :disable="maximizedToggle"
              @click="maximizedToggle = true"
            >
              <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
            </q-btn>

            <q-btn v-close-popup dense flat icon="close">
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-form class="q-pa-md q-gutter-sm" @submit="onSubmit">
            <q-input
              v-model="title"
              label="Заголовок *"
              hide-bottom-space
              no-error-icon
              lazy-rules
              :rules="[(val: string) => !!val || 'Заголовок обязателен']"
            />

            <q-file
              v-model="file"
              label="Выбирете файл"
              filled
              clearable
              style="max-width: 300px"
            />

            <q-img
              v-if="file"
              id="file"
              :src="preview"
              :ratio="4 / 3"
              style="height: 300px; max-width: 500px"
            >
              <template #error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  Cannot load image
                </div>
              </template>
            </q-img>

            <q-editor
              v-model="editor"
              :dense="$q.screen.lt.md"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify'],
                  },
                ],
                ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
                  },
                  {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana',
                    ],
                  },
                  'removeFormat',
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource'],
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana',
              }"
            />

            <q-btn color="primary" label="Опубликовать" type="submit" />
          </q-form>
        </q-card>
      </q-dialog>

      <!-- place QPageScroller at end of page -->
      <q-page-scroller position="bottom-right" :scroll-offset="350" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" color="accent" />
      </q-page-scroller>
    </q-page-container>

    <q-footer :class="$q.dark.isActive ? 'bg-dark' : ''" bordered>
      <q-toolbar>
        <q-toolbar-title> &copy; Новостной форум {{ new Date().getFullYear() }} </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
