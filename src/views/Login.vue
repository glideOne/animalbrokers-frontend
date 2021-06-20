<template>
  <v-container>
    <v-row style="padding-top: 10px">
      <v-col>
        <h2>Animal Brokers - Log in</h2>
      </v-col>
    </v-row>

    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <form>
          <div class="mb-3">
<!--            <label for="exampleInputEmail1" class="form-label">Email address</label>-->
            <input type="email" v-model="email" class="form-control" id="exampleInputEmail1" placeholder="E-mail" aria-describedby="emailHelp" required>
<!--            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>-->
          </div>
          <div class="mb-3">
<!--            <label for="exampleInputPassword1" class="form-label">Password</label>-->
            <input type="password" v-model="password" class="form-control" placeholder="Password" id="exampleInputPassword1" required>
          </div>
<!--          <div class="mb-3 form-check">-->
<!--            <input type="checkbox" class="form-check-input" id="exampleCheck1">-->
<!--            <label class="form-check-label" for="exampleCheck1">Check me out</label>-->
<!--          </div>-->
          <button v-on:click.prevent="login" class="btn btn-primary">Login</button>
        </form>
      </div>
      <div class="col-md-3"></div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    }
  },

  methods: {
    login: function () {
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
        .catch(error => { console.log(error) })
    }
  }
}
</script>

<style scoped>

</style>