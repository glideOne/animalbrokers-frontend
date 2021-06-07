<template>
  <div>

    <template>
      <form>

        <template>
          <v-form>
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                    sm="6"
                >
                  <v-text-field
                      v-model="text"
                      :counter="160"
                      label="Thread title"
                      required
                      validate-on-blur
                      solo-inverted
                  ></v-text-field>

                  <v-textarea
                      name="input-7-1"
                      filled
                      label="Description"
                      auto-grow
                      placeholder="Type in all the details of your post here..."
                  ></v-textarea>

                  <v-select
                      :items="threadTypes"
                      item-text="id"
                      item-value="id"
                      label="Thread type"
                      auto
                      single-line
                      solo
                  ></v-select>

                  <v-select
                      :items="animalClasses"
                      item-text="name"
                      item-value="id"
                      label="Animal class"
                      @input="changedClass"
                      auto
                      single-line
                      solo
                  ></v-select>

                  <v-select
                      :items="animalBreeds"
                      item-text="name"
                      item-value="id"
                      label="Animal breed"
                      auto
                      single-line
                      solo
                  ></v-select>

                </v-col>

                <v-col
                    cols="12"
                    sm="6"
                >
                  <v-text-field
                      v-model="last"
                      label="Last Name"
                      solo-inverted
                  ></v-text-field>

                  <v-row justify="center">
                    <v-date-picker v-model="picker"></v-date-picker>
                  </v-row>

                </v-col>
              </v-row>

              <v-row>
                <div style="height: 400pt; border: 1pt solid black"></div>
              </v-row>

            </v-container>
          </v-form>
        </template>

      </form>
    </template>

  </div>
</template>

<script>
export default {
  name: "CreateThread",

  data() {
    return {
      threadTypes: [],
      animalClasses: [],
      animalBreeds: []
    }
  },

  methods: {
    getThreadTypes: function () {
      this.$http.get('/api/v1/threads/types',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(function (response) {
        this.threadTypes = response.data
      })
    },

    getAnimalClasses: function () {
      this.$http.get('/api/v1/classes',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(function (response) {
        this.animalClasses = response.data
      })
    },

    changedClass(animalClassId) {
      this.$http.get('/api/v1/breeds?animalClassId=' + animalClassId,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(function (response) {
        this.animalBreeds = response.data
      })
    }

  },

  beforeMount() {
    this.getThreadTypes();
    this.getAnimalClasses();
  }

}
</script>

<style scoped>

</style>