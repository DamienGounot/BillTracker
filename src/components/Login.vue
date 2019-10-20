
<template>
<div>
  <v-carousel >
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
    ></v-carousel-item>
  </v-carousel>
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
      @click="Login()"
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
  </div>
</template>

<script>
export default {
  data: () => ({
    Username: '',
    Password: '',
    show: false,
    msgType: 'error',
    statusMsg: '',
    loginGranted: false,
    items: [
      {
        src: 'https://www.swipez.in/uploads/images/landing/rQ0busDtPobLZYjPK3jrHxryWiKBxUqBxk9Ij0vAs94.jpg'
      },
      {
        src: 'https://www.oceanbankonline.com/images/businessonlinebanking_banner.jpg'
      },
      {
        src: 'https://dhakabankltd.com/wp-content/uploads/2012/12/debit-card-banner-img.jpg'
      },
      {
        src: 'https://www.bromford.co.uk/media/3731/main-page-banner.jpg'
      }
    ]
  }),

  methods: {
    async Login () {
      if (this.Password === '' || this.Username === '') {
        console.log('empty')
        this.msgType = 'warning'
        this.statusMsg = 'Username & Password are required !'
        this.show = true
      } else {
        console.log('login request')
        const login = await this.axios.post('http://localhost:4000/api/login', {
          username: this.Username,
          password: this.Password

        })
        console.log(login.data.status)
        if (!login.data.status) {
          console.log('combinaison non valide')
          this.msgType = 'error'
          this.statusMsg = 'Incorrect Username or Password !'
          this.show = true
        } else {
          console.log('combinaison valide')
          sessionStorage.setItem('session_username', this.Username)
          this.updateOperation()
        }
      }
    },
    async updateOperation () {
      console.log('Operations of User: ' + this.Username)
      const operationList = await this.axios.post('http://localhost:4000/api/operationList', {
        userID: this.Username
      })
      sessionStorage.setItem('session_operations', JSON.stringify(operationList.data))
      console.log('Operation List Updated !')
      this.$router.push('/Home')
    },

    async createNewUser () {
      if (this.Password === '' || this.Username === '') {
        console.log('empty')
        this.msgType = 'warning'
        this.statusMsg = 'Username & Password are required !'
        this.show = true
      } else {
        // server request to know if a user already exist
        const jsondata = await this.axios.post('http://localhost:4000/api/register', {
          username: this.Username
        })
        if (!jsondata.data.status) {
          console.log('user existant')
          this.msgType = 'warning'
          this.statusMsg = 'The User ' + this.Username + ' already exist !'
          this.show = true
        } else {
          // add new user
          this.axios.post('http://localhost:4000/api/createuser', {
            username: this.Username,
            password: this.Password
          })

          this.msgType = 'success'
          this.statusMsg = 'The User ' + this.Username + ' has been successfully created !'
          this.show = true
          this.Username = ''
          this.Password = ''
        }
      }
    }
  }
}
</script>
