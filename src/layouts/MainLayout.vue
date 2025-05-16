<template>
  <q-layout view="hHh Lpr fFf" container class="shadow-2 rounded-borders window-height">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Cosy Lights</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white">
      <q-tabs
        class="text-blue-14"
        active-color="white"
        active-bg-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab name="home" icon="home" to="/" />
        <q-route-tab name="camera" icon="add_a_photo" to="/camera" />
        <q-route-tab name="settings" icon="settings" to="/settings" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>

</script>
