<template>
  <div>{{id}}</div>
</template>

<script>
export default {
  name: "Thread",

  data(){
    return {
      id: this.$route.params.id,
      thread: {}
    }
  },

  methods: {
    getThread() {
      this.$http.get('/api/v1/thread/' + this.id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(response => this.thread = response.data)
    },


  },

  beforeMount() {
  }

}
</script>

<style scoped>

</style>