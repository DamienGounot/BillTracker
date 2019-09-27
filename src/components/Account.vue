<template>
  <v-card
    class="mx-auto overflow-hidden"
    height="400"
  >

    <v-app-bar
      color="grey darken-1"
      dark
      prominent
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>

      <div class="flex-grow-1" ></div>

    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
        >

          <v-list-item>
            <v-list-item-title>History</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Add Bank Operation</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    pageTitle: 'Accounts'
  }),

  watch: {
    group () {
      this.drawer = false
    }
  },

  methods: {
    logout () {
      // eslint-disable-next-line no-unused-vars
      this.axios.post('http://localhost:4000/api/logout')
      console.log('logout')
      this.$router.push('/')
    }
  }
}

</script>
