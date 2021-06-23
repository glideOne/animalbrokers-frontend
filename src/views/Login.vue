<template>
  <v-container>
    <v-row style="padding-top: 10px">
      <v-col>
          <h2>Animal Brokers - Log in</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="3"></v-col>
      <v-col sm="6">
        <v-form ref="loginForm">

          <v-text-field v-model="email"
                        label="E-mail"
                        filled
                        :rules="emailRules"
                        validate-on-blur

          >
          </v-text-field>

          <v-text-field v-model="password"
                        label="Password"
                        filled
                        :rules="passwordRules"
                        type="password"
                        validate-on-blur

          >
          </v-text-field>

          <div v-if="showErrorMessage" style="color: red">Invalid credentials!</div>
          <br>
          <v-btn
              color="primary"
              elevation="9"
              @click="login"
          >Login</v-btn>

        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      emailRules: [
        v => !!v || 'E-mail is required.',
        v => !!v && /.+@.+/.test(v) || 'Invalid e-mail.',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => !!v && v.length >= 6 || 'Password must have at least 6 characters.',
      ],
      email: "",
      password: "",
      showErrorMessage: false,
    }
  },

  methods: {
    login() {
      if (!this.$refs.loginForm.validate()) {
        return;
      }

      this.$http.post('/api/v1/auth/login', {
        email: this.email,
        password: this.password
      }, {
        headers: {

        }
      }).then(function (response) {
        console.log(response);
        this.submitted = true;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.userDto))
      }).then(() => this.$router.push(this.$route.query.redirect || '/dashboard'))
        .catch(() => {
          this.showErrorMessage = true;
        })
    }
  }
}
</script>

<style scoped>

</style>