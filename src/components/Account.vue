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
            <v-list-item-title @click="goToHome">History</v-list-item-title>
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
      <v-data-table
    :headers="headers"
    :items="accounts"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    User: sessionStorage.getItem('session_username'),
    drawer: false,
    group: null,
    pageTitle: 'Accounts',
    headers: [
      { text: 'Account Name', value: 'accountName' },
      { text: 'Account ID', value: 'accountID' },
      { text: 'Total Amount ($)', value: 'total' }
    ],
    accounts: JSON.parse(sessionStorage.getItem('session_accounts'))
  }),

  watch: {
    group () {
      this.drawer = false
    }
  },

  methods: {
    logout () {
      this.axios.post('http://localhost:4000/api/logout')
      console.log('logout')
      sessionStorage.clear()
      this.$router.push('/')
    },
    goToBankOperation () {
      console.log('Operation Management of: ' + this.User)
      this.axios.post('http://localhost:4000/api/addOperation', {
        user: this.User
      })
      this.$router.push('/Operation')
    },
    goToHome () {
      this.$router.push('/Home')
    }
  }
}

</script>
