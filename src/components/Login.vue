
<template>
  <v-form>
    <v-text-field
      v-model="Username"
      label="Username"
      required
    ></v-text-field>

    <v-text-field
      v-model="Password"
      label="Password"
      required
    ></v-text-field>
    <v-btn
      color="success"
      class="mr-4"
      @click="validate"
    >
      Log in
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    Username: '',
    Password: ''
  }),

  methods: {

  }
}
</script>
