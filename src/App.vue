<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Bill</span>
        <span class="font-weight-light">Tracker</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/DamienGounot/BillTracker"
        target="_blank"
      >
        <span class="mr-2">Github Repository</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Login/>
    </v-content>
  </v-app>
</template>

<script>
import Login from './components/Login';

export default {
  name: 'App',
  components: {
    Login,
  },
  data: () => ({
    //
  }),
};
</script>
