<template>
<div>
  <v-card
    class="mx-auto overflow-hidden"
    height="auto"
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
            <v-list-item-title @click="goToAccount">Accounts</v-list-item-title>
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
    <v-expansion-panels
    v-model="panel"
    :readonly="readonly"
    multiple
    style="font-size: 1.15rem"
  >
    <v-expansion-panel>
      <v-expansion-panel-header style="font-weight: 800">Comment ajouter de l'argent sur un compte ?</v-expansion-panel-header>
      <v-expansion-panel-content>
        Pour ajouter ou retirer de l'argent d'un de vos comptes, allez dans la rubrique 'Add Bank Operation' du menu de navigation, sélectionnez le compte sur lequel vous voulez effectuer votre transaction et indiquez si il s'agit d'un ajout ou d'un retrait d'argent. Ensuite, nommez votre transaction et ajoutez son montant.
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header style="font-weight: 800">Comment ajouter un compte ?</v-expansion-panel-header>
      <v-expansion-panel-content>
       Il est possible que vous vouliez gérer plusieurs comptes, pour cela, allez dans la rubrique 'Accounts' du menu de navigation, entrez le nom du compte que vous voulez ajouter puis cliquez sur 'Create Account'. Ensuite, la liste de vos comptes s'affiche avec leurs noms, id et solde.
      </v-expansion-panel-content>
    </v-expansion-panel>
     <v-expansion-panel>
      <v-expansion-panel-header style="font-weight: 800">Comment supprimer un compte ?</v-expansion-panel-header>
      <v-expansion-panel-content>
       Pour supprimer un compte, allez dans la rubrique 'Accounts' du menu de navigation et la liste de vos comptes s'affiche. Ajoutez l'id du compte que vous voulez supprimer et cliquez sur 'Delete Account'
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header style="font-weight: 800">Comment suivre mes transactions ?</v-expansion-panel-header>
      <v-expansion-panel-content>
       Vos transactions sont répertoriées dans la page 'History'. Lorsque vous décidez d'aller sur cette page, tout l'historique de vos transactions apparait.
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header style="font-weight: 800">Je n'arrive pas à retirer de l'argent d'un compte, que faire ?</v-expansion-panel-header>
      <v-expansion-panel-content>
       Il se peut que votre solde soit insuffisant, et cela empêcherait le retrait d'argent. Il faudra le réalimenter pour avoir un solde suffisant. En effet, avec BillTracker, vous n'êtes jamais dans le négatif.
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    pageTitle: 'Help',
    User: sessionStorage.getItem('session_username')
  }),
  watch: {
    group () {
      this.drawer = false
    }
  },

  methods: {
    logout () {
      this.axios.post('/api/logout')
      console.log('logout')
      sessionStorage.clear()
      this.$router.push('/')
    },
    goToHome () {
      this.$router.push('/Home')
    },
    async goToAccount () {
      console.log('Accounts of: ' + this.User)
      const accountList = await this.axios.post('/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))
      this.$router.push('/Account')
    },

    async goToBankOperation () {
      console.log('Operation Management of: ' + this.User)
      const operationList = await this.axios.post('/api/operationList', {
        userID: this.User
      })
      const accountList = await this.axios.post('/api/accountList', {
        user: this.User
      })
      sessionStorage.setItem('session_accounts', JSON.stringify(accountList.data))
      sessionStorage.setItem('session_operations', JSON.stringify(operationList.data))
      this.$router.push('/Operation')
    }

  }
}
</script>
