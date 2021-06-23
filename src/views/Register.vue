<template>
  <v-container>
    <v-row style="padding-top: 10px">
      <v-col>
        <h2>Animal Brokers - Create account</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="3"></v-col>
      <v-col sm="6">
        <v-form v-if="!submitted" ref="registerForm">
          <v-text-field v-model="firstName"
                        label="First name"
                        filled dense
                        :rules="nameRules"
                        validate-on-blur
          >
          </v-text-field>

          <v-text-field v-model="lastName"
                        label="Last name"
                        filled dense
                        :rules="nameRules"
                        validate-on-blur
          >
          </v-text-field>

          <v-text-field v-model="email"
                        label="E-mail"
                        filled dense
                        :rules="emailRules"
                        validate-on-blur
          >
          </v-text-field>

          <v-text-field v-model="password"
                        label="Password"
                        filled dense
                        :rules="passwordRules"
                        type="password"
                        validate-on-blur
          >
          </v-text-field>

          <v-text-field v-model="reenterPassword"
                        label="Re-enter password"
                        filled dense
                        :rules="reenterPasswordRules"
                        type="password"
                        validate-on-blur
          >
          </v-text-field>

          <v-text-field v-model="username"
                        label="Username"
                        filled dense
                        validate-on-blur
                        hint="You can choose a username as your alias. Or not."
                        persistent-hint
          >
          </v-text-field>

          <div v-if="errorMessage != null" style="color: red">{{ this.errorMessage }}</div>
          <br>

          <v-btn
              color="primary"
              elevation="9"
              @click="register"
          >Register!
          </v-btn>

        </v-form>
        <div v-if="submitted">
          <h3>User was created!</h3>
        </div>
      </v-col>
      <div class="col-md-3"></div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: null,
      reenterPassword: "",
      username: "",
      submitted: false,
      errorMessage: null,
      nameRules: [
        v => !!v || 'Name is required.'
      ],
      emailRules: [
        v => !!v || 'E-mail is required.',
        v => !!v && /.+@.+/.test(v) || 'Invalid e-mail.',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => !!v && v.length >= 6 || 'Password must have at least 6 characters.',
      ],
      reenterPasswordRules: [
        v => !!v || 'Password is required',
        v => !!v && v.length >= 6 || 'Password must have at least 6 characters.',
        v => !!v && this.password !== null && (v === this.password) || 'Passwords do not match!'
      ]
    }
  },

  methods: {
    register() {
      if (!this.$refs.registerForm.validate()) {
        return;
      }

      this.$http.post('/api/v1/users', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        username: this.username
      }, {
        headers: {
          // 'Access-Control-Allow-Origin': '*'
        }
      }).then(function (response) {
        console.log(response);
        this.submitted = true;
      }).catch((error) => {
        this.errorMessage = error.body.message;
      })
    }
  }
}
</script>

<style scoped>

</style>