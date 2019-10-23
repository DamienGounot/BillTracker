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
            <v-list-item-title @click="goToHome">History</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="goToHelp">Help</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="goToAccount()">Accounts</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div>
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
      <v-select
        v-model="OperationAccountID"
        :items="accounts"
        item-text="accountID"
        :rules="[v => !!v || 'Account is required']"
        label="Account ID"
        required
      ></v-select>

      <v-text-field
        v-model="OperationName"
        :rules="[v => !!v || 'Operation is required']"
        label="Operation Name"
        required
      ></v-text-field>
         <v-select
        v-model="OperationType"
        :items="type"
        :rules="[v => !!v || 'Type is required']"
        label="Operation Type"
        required
        @change="updateOperationButton"
      ></v-select>
      <div>
     <v-subheader>Operation Amount</v-subheader>
      <v-slider
            v-model="OperationAmount"
            class="align-center"
            :max="1000"
            :min="0"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model="OperationAmount"
                class="mt-0 pt-0"
                single-line
                type="number"
                :max="1000"
                :min="0"
                style="width: 60px"
              ></v-text-field>
            </template>
          </v-slider>
      </div>
      <v-btn
        class="mr-4"
        :disabled='!isCompleteOperationAccountID || !isCompleteOperationName || !isCompleteOperationAmount || !isCompleteOperationType'
        :block="true"
        color= 'warning'
        @click="addOperation()"
      >
        Add Operation
      </v-btn>
    </v-form>
               <v-btn
        class="mr-4"
        :block="true"
        :disabled='!isCompleteOperationAccountID && !isCompleteOperationName && !isCompleteOperationAmount && !isCompleteOperationType'
        @click="clear"
      >
        Clear
      </v-btn>
      </div>
    </v-row>
  </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    pageTitle: 'Bank Operation',
    type: [
      { text: 'Withdraw', value: 'withdraw' },
      { text: 'Deposit', value: 'deposit' }
    ],
    accounts: JSON.parse(sessionStorage.getItem('session_accounts')),
    operations: JSON.parse(sessionStorage.getItem('session_operations')),
    User: sessionStorage.getItem('session_username'),
    OperationName: '',
    OperationAccountID: '',
    OperationType: '',
    OperationAmount: '',
    show: false,
    msgType: 'error',
    statusMsg: ''
  }),

  watch: {
    group () {
      this.drawer = false
    },
    accounts: JSON.parse(sessionStorage.getItem('session_accounts')),
    operations: JSON.parse(sessionStorage.getItem('session_operations'))
  },

  computed: {
    isCompleteOperationName () {
      return this.OperationName
    },
    isCompleteOperationAccountID () {
      return this.OperationAccountID
    },
    isCompleteOperationType () {
      return this.OperationType
    },
    isCompleteOperationAmount () {
      return this.OperationAmount
    }
  },

  methods: {
    logout () {
      this.axios.post('http://localhost:4000/api/logout')
      console.log('logout')
      sessionStorage.clear()
      this.$router.push('/')
    },
    goToHelp () {
      this.$router.push('/Help')
    },

    async goToAccount () {
      console.log('Accounts of: ' + this.User)
      const accountList = await this.axios.post('http://localhost:4000/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))
      this.$router.push('/Account')
    },
    goToHome () {
      this.$router.push('/Home')
    },

    clear () {
      this.OperationName = ''
      this.OperationAccountID = null
      this.OperationAmount = ''
      this.OperationType = null
      this.show = false
    },
    async addOperation () {
      console.log('Add operation')
      const reponse = await this.axios.post('http://localhost:4000/api/addOperation', {
        accountID: this.OperationAccountID,
        operationName: this.OperationName,
        type: this.OperationType,
        amount: this.OperationAmount,
        userID: this.User
      })
      this.updateOperation()
      this.updateAccounts()
      if (reponse.data.message === 'success') {
        this.msgType = 'success'
        this.statusMsg = 'Operation ' + reponse.data.operationID + ' success !'
        this.show = true
      } else if (reponse.data.message === 'error') {
        this.msgType = 'error'
        this.statusMsg = 'An error occured'
        this.show = true
      }
    },
    async updateAccounts () {
      console.log('Accounts of: ' + this.User)
      const accountList = await this.axios.post('http://localhost:4000/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))

      this.accounts = JSON.parse(sessionStorage.getItem('session_accounts'))
      console.log('Account List Updated !')
    },
    async updateOperation () {
      console.log('Operations of User: ' + this.User)
      const operationList = await this.axios.post('http://localhost:4000/api/operationList', {
        userID: this.User
      })
      sessionStorage.setItem('session_operations', JSON.stringify(operationList.data))
      this.operations = JSON.parse(sessionStorage.getItem('session_operations'))
      console.log('Operation List Updated !')
    }
  }
}

</script>
