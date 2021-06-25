<template>
  <div>
    <br>
    <h1>Users Management</h1>

    <v-row>
      <v-col sm="2"></v-col>
      <v-col sm="8">

        <v-data-table
            :headers="headers"
            :items="nonAdmins"
            :items-per-page="10"
            class="elevation-1"
        >
          <template #item.activateButton="{ item }">
            <v-btn x-small
                   v-if="!item.active"
                   @click="activateUser(item.id)"
            >Activate
            </v-btn>
            <v-btn x-small
                   v-if="item.active"
                   @click="deactivateUser(item.id)"
            >Deactivate
            </v-btn>
          </template>

        </v-data-table>


      </v-col>
      <v-col sm="2"></v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  name: "UsersManagement",

  data() {
    return {
      users: [],
      nonAdmins: [],
      headers: [
        {text: 'First Name', value: 'firstName'},
        {text: 'Last Name', value: 'lastName'},
        {text: 'E-mail', value: 'email'},
        {text: 'Username', value: 'username'},
        {text: 'Active', value: 'activateButton'},
      ],
    }
  },

  methods: {

    getUsers() {
      this.$http.get('/api/v1/users', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(response => {
        this.users = response.data;

        for (let i in this.users) {
          if (this.users[i].role !== 'ADMIN') {
            this.nonAdmins.push(this.users[i]);
          }
        }

      })
    },

    activateUser(id) {
      this.$http.put('/api/v1/users/activate/' + id, {}, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(() => this.$router.go(0))
    },

    deactivateUser(id) {
      this.$http.put('/api/v1/users/deactivate/' + id, {}, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(() => this.$router.go(0))
    },

  },

  beforeMount() {
    this.getUsers();
  },
}
</script>

<style scoped>

</style>