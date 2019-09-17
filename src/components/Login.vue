
<template>
  <v-form>
           <v-alert
      v-model="show"
      :dismissible=false
      :type="msgType"
    >
      {{statusMsg}}
    </v-alert>
    <v-text-field
      v-model="Username"
      label="Username"
      required
      clearable
    ></v-text-field>
    <v-text-field
      v-model="Password"
      label="Password"
      type='password'
      required
      clearable
    ></v-text-field>
    <v-btn
      color=success
      @click="Login"
      block
      rounded
    >
      Log in
    </v-btn>
        <v-btn
      color=error
      block
      rounded
      @click="createNewUser"
    >
      Register
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    Username: '',
    Password: '',
    show: false,
    msgType: '',
    statusMsg: '',
    Users: [{ Username: 'root', Password: 'root' }]
  }),

  methods: {
    Login () {
      if (this.Password === '' || this.Username === '') {
        console.log('empty')
        this.msgType = 'warning'
        this.statusMsg = 'Username & Password are required !'
        this.show = true
      } else {
        console.log('parcours des users')
        this.Users.forEach(element => {
          if (this.Username !== element.Username || this.Password !== element.Password) {
            console.log('erreur combinaison')
            this.msgType = 'error'
            this.statusMsg = 'Incorrect Username or Password !'
            this.show = true
          } else {
            console.log('combinaison valide')
            this.msgType = 'success'
            this.statusMsg = 'Logged in as ' + element.Username
            this.show = true
          }
        })
      }
      console.log(JSON.stringify(this.Users))
    },
    createNewUser () {
      if (this.Password === '' || this.Username === '') {
        console.log('empty')
        this.msgType = 'warning'
        this.statusMsg = 'Username & Password are required !'
        this.show = true
      } else {
        this.Users.forEach(element => {
          console.log('parcours des users')
          if (this.Username === element.Username) {
            console.log('user existant')
            this.msgType = 'warning'
            this.statusMsg = 'The User ' + element.Username + ' already exist !'
            this.show = true
          } else {
            console.log('user créer')
            this.Users.push({
              Username: this.Username,
              Password: this.Password })
            this.msgType = 'success'
            this.statusMsg = 'The User ' + this.Username + ' has been successfully created !'
            this.show = true
            this.Username = ''
            this.Password = ''
            console.log(JSON.stringify(this.Users))
          }
        })
      }
    }
  }
}
</script>
