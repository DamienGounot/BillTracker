<template>
  <v-card
    class="mx-auto overflow-hidden"
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
    <div>Welcome {{User}}
        <v-data-table
    :headers="headers"
    :items="operations"
    :items-per-page="All"
    class="elevation-1"
  ></v-data-table>
    </div>

  </v-card>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    pageTitle: 'History',
    headers: [
      { text: 'Operation ID', value: 'operationID' },
      { text: 'Operation Name', value: 'operationName' },
      { text: 'Account ID', value: 'accountID' },
      { text: 'Type', value: 'type' },
      { text: 'Amount', value: 'amount' }
    ],
    User: sessionStorage.getItem('session_username'),
    operations: JSON.parse(sessionStorage.getItem('session_operations'))

  }),

  watch: {
    group () {
      this.drawer = false
    },
    operations: JSON.parse(sessionStorage.getItem('session_operations'))
  },

  methods: {
    logout () {
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
    async goToBankOperation () {
      console.log('Operation Management of: ' + this.User)
      const operationList = await this.axios.post('http://localhost:4000/api/operationList', {
        userID: this.User
      })
      const accountList = await this.axios.post('http://localhost:4000/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))
      sessionStorage.setItem('session_operations', JSON.stringify(operationList.data))
      this.$router.push('/Operation')
    },
    goToHelp () {
      this.$router.push('/Help')
    }
  }
}

</script>
