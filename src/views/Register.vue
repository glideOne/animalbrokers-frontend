<template>
  <div class="container">
    <br>
    <h1>Animal Brokers - Create account</h1>
    <br>
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <label for="firstName" class="form-label">First Name:</label>
            <input type="text" class="form-control" id="firstName" placeholder="enter first name" required>
          </div>
          <div class="form-group">
            <label for="lastName" class="form-label">Last Name:</label>
            <input type="text" class="form-control" id="lastName" placeholder="enter last name" required>
          </div>
          <div class="form-group">
            <label for="email" class="form-label">E-mail:</label>
            <input type="email" class="form-control" id="email" placeholder="enter e-mail" required>
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password:</label>
            <input type="password" class="form-control" placeholder="enter password" id="password" required>
          </div>
          <div class="form-group">
            <label for="userName" class="form-label">Username:</label>
            <input type="text" class="form-control" id="userName" placeholder="enter username">
            <div id="userNameHelp" class="form-text">You can choose a username as your alias. Or not.</div>
          </div>
          <!--          <div class="mb-3 form-check">-->
          <!--            <input type="checkbox" class="form-check-input" id="exampleCheck1">-->
          <!--            <label class="form-check-label" for="exampleCheck1">Check me out</label>-->
          <!--          </div>-->
          <button style="margin-top: 15pt" type="submit" id="register" class="btn btn-primary">Register!</button>
        </form>
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.form-label {
  float: left;
  /*border: 1pt black solid;*/
  padding-left: 10pt;
  padding-top: 10pt;
  margin-bottom: 0pt;
}
</style>