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
             color="black"
             elevation="4"
             depressed
             small
             to="/usersmanagement"
             style="margin-left: 5px; color: white"
      >Users Management
      </v-btn>

      <v-spacer></v-spacer>

      <div v-if="isUserLoggedIn()"
           style="font-size: 14px; padding-right: 10px">
        Welcome, {{ getUserFirstName() }}!
      </div>
      <v-btn v-if="!isUserLoggedIn()"
             color="black"
             elevation="4"
             depressed
             small
             to="/login"
             style="margin-left: 5px; color: white"
      >Login
      </v-btn>

      <v-btn v-if="!isUserLoggedIn()"
             color="black"
             elevation="4"
             depressed
             small
             to="/register"
             style="margin-left: 5px; color: white"
      >Register
      </v-btn>

      <v-btn v-if="isUserLoggedIn()"
             color="black"
             elevation="4"
             depressed
             small
             @click="logout()"
             style="margin-left: 5px; color: white"
      >Logout
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
    return {}
  },

  methods: {

    shouldShowUsersManagement() {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser === null) {
        return false;
      }
      return currentUser.role === 'ADMIN';
    },

    isUserLoggedIn() {
      return localStorage.getItem('token') !== null;
    },

    getUserFirstName() {
      if (!this.isUserLoggedIn()) {
        return '';
      }
      return JSON.parse(localStorage.getItem('user')).firstName;
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
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

