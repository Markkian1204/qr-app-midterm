<template>
  <div class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card width="480" elevation="8" class="pa-6 rounded-lg">
      <v-card-text>
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-h5 font-weight-bold mb-1">Welcome</h2>
          <p class="text-caption text--secondary">Sign in to access your dashboard</p>
        </div>

        <!-- Form -->
        <v-form>
          <v-text-field
            v-model="name"
            label="Username"
            outlined
            dense
            rounded
            prepend-inner-icon="mdi-account"
            class="mb-4"
          />

          <v-text-field
            v-model="email"
            label="Password"
            type="password"
            outlined
            dense
            rounded
            prepend-inner-icon="mdi-lock"
            class="mb-4"
          />

          <v-btn color="primary" block rounded large class="mb-4">
            Login
          </v-btn>

          <!-- Divider -->
          <div class="text-center text-caption grey--text my-4">OR</div>

          <!-- Google Sign-In -->
          <v-btn
            color="black"
            block
            rounded
            elevation="2"
            @click="signinWithGoogle"
          >
            <v-icon left color="red darken-1">mdi-google</v-icon>
            Sign in with Google
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
    layout: "auth",
    middleware: "guest",
    methods: {
        signinWithGoogle(){
            this.$auth.loginWith('google')
        }
    }
}
</script>
