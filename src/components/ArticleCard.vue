<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useUserStore } from 'stores/user-store';
import { Post } from './models';

const userStore = useUserStore();

const props = defineProps(['posts']);

function deletePost(postId: number) {
  const postsList: Post[] = JSON.parse(sessionStorage.getItem('posts'));
  const newPosts = postsList.filter((val, index) => index === postId);
  sessionStorage.setItem('posts', JSON.stringify([...newPosts]));
}

const confirm = ref(false);
</script>

<template>
  <q-card
    v-for="(item, index) in props.posts"
    :key="index"
    class="q-px-sm"
    :style="$q.screen.lt.sm ? 'max-width: 300px' : 'max-width: 800px'"
  >
    <q-card-section>
      <div class="text-subtitle1">{{ item.username }} {{ item.createdAt }}</div>
      <div class="text-h4">{{ item.title }}</div>
    </q-card-section>

    <q-img
      :src="item.thumbnail"
      :ratio="1"
      class="q-pa-sm"
      :style="$q.screen.gt.md && 'width: 784px; height: 500px'"
    >
      <template #error>
        <div class="absolute-full flex flex-center bg-negative text-white">Cannot load image</div>
      </template>
    </q-img>

    <q-card-section class="ellipsis-3-lines" v-html="item.content" />

    <q-card-actions>
      <q-btn flat label="Читать" :to="{ name: 'article', params: { id: index } }" />

      <q-btn
        v-if="item.username === userStore.currentUser?.username"
        label="Удалить"
        color="negative"
        @click="confirm = true"
      />
    </q-card-actions>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Вы точно хотите удалить данную публикацию?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Отменить" color="primary" />
          <q-btn v-close-popup flat label="Удалить" color="negative" @click="deletePost(index)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
