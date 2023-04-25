<script setup lang="ts">
import { Post } from 'src/components/models';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();

const post = computed(() => {
  const posts: Post[] = JSON.parse(sessionStorage.getItem('posts'));

  return posts.find((val, index) => index === parseInt(params.id, 10));
});

console.log(post);
</script>

<template>
  <q-page class="column items-center justify-evenly q-my-md">
    <q-card class="q-px-sm" :style="$q.screen.lt.sm ? 'max-width: 300px' : 'max-width: 1000px'">
      <q-card-section>
        <div class="text-subtitle1">{{ post.username }} {{ post.createdAt }}</div>
        <div class="text-h4">{{ post.title }}</div>
      </q-card-section>
      <q-img
        :src="post.thumbnail"
        :ratio="1"
        class="q-pa-sm"
        :style="$q.screen.gt.md && 'width: 994px; height: 500px'"
      >
        <template #error>
          <div class="absolute-full flex flex-center bg-negative text-white">Cannot load image</div>
        </template>
      </q-img>

      <q-card-section v-html="post.content" />
    </q-card>
  </q-page>
</template>
