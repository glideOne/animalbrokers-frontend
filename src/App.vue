<template>
  <v-app>
    <v-app-bar
        app
        color="primary">

      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
        />

        <div style="font-size: 20pt">Animal Brokers</div>

      </div>

      <v-col></v-col>

      <v-btn v-if="shouldShowUsersManagement()"
          color="white"
          elevation="4"
          outlined
          text
          small
          to="/usersmanagement"
      >Users Management
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
          color="white"
          elevation="4"
          outlined
          text
          small
          to="/login"
      >Login
      </v-btn>

      <div style="width: 5pt"></div>

      <v-btn
          color="white"
          elevation="4"
          outlined
          text
          small
          to="/register"
      >Register
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data() {
    return {

    }
  },

  methods: {
    shouldShowUsersManagement() {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser === null) {
        return false;
      }
      return currentUser.role === 'ADMIN';
    }
  }

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}
</style>

