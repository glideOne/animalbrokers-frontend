<template>
  <div class="container">
    <br>
    <h1>Dashboard</h1>

    <v-row>
      <v-col
          cols="12"
          sm="4">

        <h5>Lost</h5>

        <v-data-table
            :headers="headers"
            :items="lostThreads"
            :items-per-page="5"
            class="elevation-1"
            @click:row="handleClick"
        >
          <template #item.creatorName="{ item }">
            {{ item.creator.firstName }} {{ item.creator.lastName }}
          </template>
        </v-data-table>

      </v-col>

      <v-col
          cols="12"
          sm="4">

        <h5>Found</h5>

        <v-data-table
            :headers="headers"
            :items="foundThreads"
            :items-per-page="5"
            class="elevation-1"
            @click:row="handleClick"
        >
          <template #item.creatorName="{ item }">
            {{ item.creator.firstName }} {{ item.creator.lastName }}
          </template>
        </v-data-table>

      </v-col>

      <v-col
          cols="12"
          sm="4">

        <h5>Other</h5>

        <v-data-table
            :headers="headers"
            :items="otherThreads"
            :items-per-page="5"
            class="elevation-1"
            @click:row="handleClick"
        >
          <template #item.creatorName="{ item }">
            {{ item.creator.firstName }} {{ item.creator.lastName }}
          </template>
          <template #item.shortDescription="{ item }">
            {{ item.shortDescription }}
          </template>
        </v-data-table>

      </v-col>
    </v-row>

    <v-col></v-col>

    <v-btn
        elevation="2"
        absolute
        left
        to="/createthread"
    >Create new thread
    </v-btn>
  </div>


</template>

<script>
export default {
  name: "Dashboard",

  data() {
    return {
      lostThreads: [],
      foundThreads: [],
      otherThreads: [],
      headers: [
        {text: 'Title', value: 'title'},
        {text: 'Creator', value: 'creatorName'},
        {text: 'Description', value: 'shortDescription'}
      ],

    }
  },

  methods: {
    searchLostThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: 'LOST'
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.lostThreads = response.data;
            this.shortenDescription(this.lostThreads);
          })
    },

    searchFoundThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: 'FOUND'
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.foundThreads = response.data;
            this.shortenDescription(this.foundThreads);
          })
    },

    searchOtherThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: 'OTHER'
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.otherThreads = response.data;
            this.shortenDescription(this.otherThreads);
          })
    },

    handleClick(thread) {
      this.$router.push("/thread/" + thread.id)
    },

    shortenDescription(threads) {
      if (threads == null) {
        return;
      }
      for (let i = 0; i < threads.length; i++) {
        threads[i].shortDescription = this.trimText(threads[i].description);
      }
    },

    trimText(text) {
      if (text == null) {
        return "";
      }
      if (text.length < 50) {
        return text;
      }
      return text.substr(0, 50) + '...';
    },

  },

  beforeMount() {
    this.searchLostThreads();
    this.searchFoundThreads();
    this.searchOtherThreads();
  }
}
</script>

<style scoped>
td {
  text-align: left;
}
</style>