<template>
  <v-container>
    <v-row style="padding-top: 10px">
      <v-col>
        <h2>Search Threads</h2>
      </v-col>
    </v-row>

    <v-sheet height="64" style="margin-top: 30px; margin-bottom: 30px">
      <v-toolbar flat>
        <v-select v-model="input.threadType"
                  :items="threadTypes"
                  label="Thread type"
                  return-object
                  style="padding-right: 20px; max-width: 240px; padding-top: 20px"
                  @change="searchThreads()"
        ></v-select>
        <v-text-field v-model="input.text"
                      label="Text"
                      return-object
                      style="padding-right: 20px; max-width: 240px; padding-top: 20px"
                      @blur="searchThreads()"
        ></v-text-field>
        <v-select v-model="input.animalClass"
                  :items="animalClasses"
                  label="Animal class"
                  item-value="id" item-text="name"
                  @input="changedClass"
                  return-object
                  style="padding-right: 20px; max-width: 240px; padding-top: 20px"
                  @change="searchThreads()"
        ></v-select>
        <v-select v-model="input.animalBreed"
                  v-if="selectedClass"
                  :items="animalBreeds"
                  label="Animal breed"
                  item-value="id" item-text="name"
                  return-object single-line
                  style="padding-right: 20px; max-width: 240px; padding-top: 20px"
                  @change="searchThreads()"
        ></v-select>
        <v-spacer></v-spacer>
        <v-btn text outlined
               small color="primary"
               @click="clearValuesAndSearch()">
          <v-icon small>
            mdi-close
          </v-icon>
          Clear filters
        </v-btn>
      </v-toolbar>
    </v-sheet>

    <v-row>
      <v-data-table
          :headers="headers"
          :items="threads"
          :items-per-page="10"
          class="elevation-2"
          @click:row="handleClick"
      >
        <template v-slot:item.description="{ item }">
          {{ trimText(item.description) }}
        </template>

        <template v-slot:item.lastSeenTime="{ item }">
          {{ item.lastSeenTime !== undefined ? item.lastSeenTime.replace('T', ' ').substring(0, 16) : '' }}
        </template>

        <template v-slot:item.creator="{ item }">
          {{ item.creator.firstName }} {{ item.creator.lastName }}
        </template>

        <template v-slot:item.photo="{ item }">
          <div style="padding-top: 7px; padding-bottom: 7px">
            <v-img :src="getImage(item)" width="100" class="ml-3"></v-img>
          </div>
        </template>

      </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SearchThreads",

  data() {
    return {
      input: {
        threadType: null,
        text: null,
        animalClass: {},
        animalBreed: {}
      },
      threadTypes: [],
      animalClasses: [],
      animalBreeds: [],
      selectedClass: false,
      threads: [],
      headers: [
        {text: 'Title', value: 'title', width: '14%'},
        {text: 'Description', value: 'description', width: '30%', sortable: false},
        {text: 'Thread type', value: 'type', width: '8%'},
        {text: 'Animal class', value: 'animalClassName', width: '8%'},
        {text: 'Animal breed', value: 'animalBreedName', width: '10%'},
        {text: 'Last seen time', value: 'lastSeenTime', width: '10%'},
        {text: 'Creator', value: 'creator', width: '10%', sortable: false},
        {text: 'Last known photo', value: 'photo', width: '10%', sortable: false}
      ]
    }
  },

  methods: {
    searchThreads() {
      this.$http.get('/api/v1/threads',
          {
            params: {
              type: this.input.threadType,
              text: this.input.text,
              animalClassId: this.input.animalClass.id,
              animalBreedId: this.input.animalBreed.id
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.threads = response.data);
    },

    handleClick(thread) {
      this.$router.push("/thread/" + thread.id)
    },

    getThreadTypes() {
      this.$http.get('/api/v1/threads/types',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(response => this.threadTypes = response.data)
    },

    getAnimalClasses() {
      this.$http.get('/api/v1/classes',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }).then(response => this.animalClasses = response.data)
    },

    changedClass(animalClass) {
      this.$http.get('/api/v1/breeds?animalClassId=' + animalClass.id,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.input.animalBreed = {}; // reset the old breed filter
            this.animalBreeds = response.data;
            this.selectedClass = true;
          })
    },

    trimText(text) {
      if (text == null) {
        return "";
      }
      if (text.length < 200) {
        return text;
      }
      return text.substr(0, 200) + '...';
    },

    getImage(item) {
      if (item.photos === undefined || item.photos[0] === undefined) {
        return null;
      }
      return 'data:image/jpeg;base64,' + item.photos[0].image;
    },

    clearValuesAndSearch() {
      this.input.threadType = null;
      this.input.text = null;
      this.input.animalClass = {};
      this.input.animalBreed = {};
      this.selectedClass = false;
      this.searchThreads();
    },

  },

  beforeMount() {
    this.getThreadTypes();
    this.getAnimalClasses();
    this.clearValuesAndSearch();
  }
}
</script>

<style scoped>

</style>