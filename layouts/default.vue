<template>
  <v-app dark>
    <!-- Top App Bar -->
    <v-app-bar app flat>
      <v-spacer />
      <v-toolbar-title class="text-center font-weight-bold">QR Scanner</v-toolbar-title>
      <v-spacer />
      <v-btn @click="$auth.logout()" color="blue" dark class="ml-4">Logout</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: ['auth']
}
</script>

