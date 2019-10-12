<template>
<div>
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
            <v-list-item-title @click="goToHome">History</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="goToBankOperation">Add Bank Operation</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  <div>
        <v-data-table
    :headers="headers"
    :items="accounts"
    :items-per-page="All"
    class="elevation-1"
  ></v-data-table>
    <v-row align="center">
    <v-row justify="space-around">
      <div>
        <v-form
      ref="form"
    >
               <v-alert
      v-model="show"
      :dismissible=false
      :type="msgType"
    >
      {{statusMsg}}
    </v-alert>
      <v-text-field
        v-model="NameNewAccount"
        :rules="[v => !!v || 'Account is required']"
        label="Account Name"
        required
      ></v-text-field>
      <v-btn
        :disabled='!isCompleteNewAccount'
        color="success"
        class="mr-4"
        :block="true"
        @click="createAccount()"
      >
        Create Account
      </v-btn>
      <v-select
        v-model="idDelAccount"
        :items="accounts"
        item-text="accountID"
        :rules="[v => !!v || 'Account is required']"
        label="Account ID"
        required
      ></v-select>

      <v-btn
        color="error"
        class="mr-4"
        :disabled='!isCompleteDeleteAccount'
        :block="true"
        @click="deleteAccount()"
      >
        Delete Account
      </v-btn>
    </v-form>
               <v-btn
        class="mr-4"
        :block="true"
        :disabled='!isCompleteDeleteAccount && !isCompleteNewAccount'
        @click="clear"
      >
        Clear
      </v-btn>
      </div>
    </v-row>
  </v-row>
  </div>
  </v-card>

  </div>
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
    accounts: JSON.parse(sessionStorage.getItem('session_accounts')),

    NameNewAccount: '',
    idDelAccount: '',

    show: false,
    msgType: 'error',
    statusMsg: ''
  }),

  watch: {
    group () {
      this.drawer = false
    },
    accounts: JSON.parse(sessionStorage.getItem('session_accounts'))
  },
  computed: {
    isCompleteNewAccount () {
      return this.NameNewAccount
    },
    isCompleteDeleteAccount () {
      return this.idDelAccount
    }
  },

  methods: {
    logout () {
      this.axios.post('http://localhost:4000/api/logout')
      console.log('logout')
      sessionStorage.clear()
      this.$router.push('/')
    },
    async goToBankOperation () {
      console.log('Operation Management of: ' + this.User)
      const operationList = await this.axios.post('http://localhost:4000/api/operationList', {
        userID: this.User
      })
      sessionStorage.setItem('session_operations', JSON.stringify(operationList.data))
      this.$router.push('/Operation')
    },
    goToHome () {
      this.$router.push('/Home')
    },
    clear () {
      this.NameNewAccount = ''
      this.idDelAccount = null
      this.show = false
    },
    deleteAccount () {
      console.log('Delete account with id: ' + this.idDelAccount)
      this.axios.post('http://localhost:4000/api/deleteAccount', {
        idToRemove: this.idDelAccount
      })
      this.show = true
      this.msgType = 'success'
      this.statusMsg = 'You have deleted the account with Id : ' + this.idDelAccount
      this.updateAccounts()
    },
    async createAccount () {
      console.log('Create account with Name: ' + this.NameNewAccount)
      const answer = await this.axios.post('http://localhost:4000/api/createAccount', {
        Name: this.NameNewAccount,
        User: this.User
      })
      if (answer.data.message === 'success') {
        this.show = true
        this.msgType = 'success'
        this.statusMsg = 'You have created the account : ' + this.NameNewAccount
        this.NameNewAccount = ''
      } else if (answer.data.message === 'error') {
        this.show = true
        this.msgType = 'error'
        this.statusMsg = 'An error occured for : ' + this.NameNewAccount
        this.NameNewAccount = ''
      }

      this.updateAccounts()
    },
    async updateAccounts () {
      console.log('Accounts of: ' + this.User)
      const accountList = await this.axios.post('http://localhost:4000/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))
      this.accounts = JSON.parse(sessionStorage.getItem('session_accounts'))
      console.log('Account List Updated !')
    }
  }
}

</script>
