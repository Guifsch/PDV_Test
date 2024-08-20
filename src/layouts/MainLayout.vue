<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered :persistent="false">
      <q-list>
        <div class="flex justify-center">
          <q-item-label header> Menu </q-item-label>
        </div>

        <CustomMenu
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          @click="toggleLeftDrawer"
        />
      </q-list>
    </q-drawer>

    <q-page-container
      class="row justify-center"
      :class="{ 'drawer-open': leftDrawerOpen }"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import CustomMenu from "src/components/CustomMenu.vue";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Home",
    icon: "school",
    link: "/",
  },
];

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style scoped>
.drawer-open {
  position: relative;
}

.drawer-open::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Cor do fundo escurecido */
  z-index: 1; /* Faz com que o overlay fique sobre o conteúdo */
  pointer-events: none; /* Permite clicar através do overlay */
}
</style>
