<template>
  <div class="container">
    <br>
    <h1>Animal Brokers - Create account</h1>
    <br>
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <form v-if="!submitted">
          <div class="form-group">
            <!--            <label for="firstName" class="form-label">First Name:</label>-->
            <input type="text" class="form-control" id="firstName" placeholder="enter first name" required
                   v-model="firstName">
          </div>
          <div class="form-group">
            <!--            <label for="lastName" class="form-label">Last Name:</label>-->
            <input type="text" class="form-control" id="lastName" placeholder="enter last name" required
                   v-model="lastName">
          </div>
          <div class="form-group">
            <!--            <label for="email" class="form-label">E-mail:</label>-->
            <input type="email" class="form-control" id="email" placeholder="enter e-mail" required v-model="email">
          </div>
          <div class="form-group">
            <!--            <label for="password" class="form-label">Password:</label>-->
            <input type="password" class="form-control" placeholder="enter password" id="password" required
                   v-model="password">
            <div v-if="password.length > 1 && password.length < 6" class="text-danger">Password should consist of at
              least 6 characters!
            </div>
          </div>
          <div class="form-group">
            <!--            <label for="password" class="form-label">Password:</label>-->
            <input type="password" class="form-control" placeholder="re-enter password" id="reenterPassword" required
                   v-model="reenterPassword">
          </div>
          <div v-if="password != reenterPassword" class="text-danger">Passwords do not match!</div>
          <div class="form-group">
            <!--            <label for="userName" class="form-label">Username:</label>-->
            <input type="text" class="form-control" id="userName" placeholder="enter username" v-model="username">
            <div id="userNameHelp" class="form-text">You can choose a username as your alias. Or not.</div>
          </div>
          <!--          <div class="mb-3 form-check">-->
          <!--            <input type="checkbox" class="form-check-input" id="exampleCheck1">-->
          <!--            <label class="form-check-label" for="exampleCheck1">Check me out</label>-->
          <!--          </div>-->
          <button style="margin-top: 15pt" v-on:click.prevent="register" id="register" class="btn-lg btn-primary">
            Register!
          </button>
        </form>
        <div v-if="submitted">
          <h3>User was created!</h3>
        </div>
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      reenterPassword: "",
      username: "",
      submitted: false,
    }
  },

  methods: {
    register: function () {
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
      })
    }
  }
}
</script>

<style scoped>
.form-group {
  padding-top: 10pt;
}

.form-label {
  float: left;
  /*border: 1pt black solid;*/
  padding-left: 10pt;
  padding-top: 10pt;
  margin-bottom: 0pt;
}
</style>