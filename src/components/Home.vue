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
            <v-list-item-title @click="goToAccount()">Accounts</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="goToBankOperation()">Add Bank Operation</v-list-item-title>
          </v-list-item>

           <v-list-item>
            <v-list-item-title @click="goToHelp()">Help</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div>Welcome {{User}}</div>

  </v-card>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    pageTitle: 'History',
    User: sessionStorage.getItem('session_username')
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
      sessionStorage.clear()
      this.$router.push('/')
    },

    async goToAccount () {
      console.log('Accounts of: ' + this.User)
      const accountList = await this.axios.post('http://localhost:4000/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))
      this.$router.push('/Account')
    },
    goToBankOperation () {
      console.log('Operation Management of: ' + this.User)
      this.axios.post('http://localhost:4000/api/addOperation', {
        user: this.User
      })
      this.$router.push('/Operation')
    },
    goToHelp () {
      this.$router.push('/Help')
    }
  }
}

</script>
