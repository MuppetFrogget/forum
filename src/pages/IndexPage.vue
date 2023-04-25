<script setup lang="ts">
import ArticleCard from 'src/components/ArticleCard.vue';
import { Post } from 'src/components/models';

const posts: Post[] = JSON.parse(sessionStorage.getItem('posts'));
</script>

<template>
  <q-page class="column items-center justify-evenly q-my-md q-gutter-lg">
    <article-card v-if="posts" :posts="posts" />

    <div v-else :class="$q.screen.gt.md ? 'text-h3' : 'text-h4 text-center'">
      В данный момент постов нет
    </div>
  </q-page>
</template>
