<template>
  <q-page>
    <q-pull-to-refresh @refresh="refresh">
      <div class="q-gutter-md">
        <q-card v-for="(item, index) in items" :key="index" class="q-mb-sm">
          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">
              <img src="{{item.photo}}" :alt="item.name" />
            </div>
            <div class="text-caption text-grey">Current Pattern: {{ item.patternName }}</div>
            <div class="text-caption text-grey">Last Updated: {{ item.lastUpdated }}</div>
          </q-card-section>

          <q-card-actions>
            <q-btn-dropdown color="primary" label="New Pattern">
              <q-list v-for="(pattern, index) in patterns"
                      :key="index"
                      class="q-mb-sm">
                <q-item clickable v-close-popup @click="patternSelected(pattern)">
                  <q-item-section>
                    <q-item-label>{{ pattern }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-actions>
        </q-card>
      </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
//import { DateTime } from 'luxon'
import { api } from 'boot/axios'
//import { useQuasar } from 'quasar'

const baseUrl = 'http://127.0.0.1:3001'
//const baseUrl = 'https://cosy-lights-8bda6cc81054.herokuapp.com'

onMounted(() => {
  loadMainData()
  loadAllPatterns()
})

// const items = ref([ {
//   name:'Bottle-1',photo:'',patternName:'white',lastUpdated:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
// }, {
//   name:'Strip-1',photo:'',patternName:'ukraine',lastUpdated:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
// } ])

const items = ref([])
const patterns = ref([])

function patternSelected(pattern) {
  console.log("clicked:" + pattern)
}

function refresh(done) {
  setTimeout(() => {
    loadMainData()
    loadAllPatterns()
    done()
  }, 1000)
}

function loadMainData() {
  api
    .get(baseUrl + '/registered')
    .then((response) => {
      console.log('/registered:response.data: ' + JSON.stringify(response.data))
      if (response.data) {
        items.value = response.data.names
      } else {
        items.value = []
      }
    })
    .catch((e) => {
      alert("unable to access server:" + e )
    })
}

function loadAllPatterns() {
  api
    .get(baseUrl + '/allpatterns')
    .then((response) => {
      console.log('/allpattern:response.data: ' + JSON.stringify(response.data))
      if (response.data) {
        patterns.value = response.data
      } else {
        patterns.value = []
      }
    })
    .catch((e) => {
      alert("unable to access server:" + e )
    })
}
</script>
