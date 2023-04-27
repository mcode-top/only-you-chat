<template>
  <div id="container">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import moment from 'moment';
import { ref, shallowRef } from 'vue';
import { RouterView } from 'vue-router';
</script>

<style>
#container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #595959;
  background-image: url(./assets/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
