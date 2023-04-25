<template>
  <q-layout view="lHh lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : ''" elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat label="Новостной форум" :to="{ name: 'main', params: { type: 'all' } }" />
        </q-toolbar-title>

        <q-btn flat stretch icon="settings_brightness" @click="$q.dark.toggle()" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped></style>
