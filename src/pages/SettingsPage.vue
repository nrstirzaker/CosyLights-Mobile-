<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">

      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="ssid"
          label="Wifi SSID"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          filled
          type="text"
          v-model="password"
          label="Wifi Password"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />



        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

    </div>
  </q-page>
</template>

<script setup>
//
</script>
