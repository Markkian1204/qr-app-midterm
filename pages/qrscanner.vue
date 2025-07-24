<template>
  <v-container class="py-6">
    <!-- Title -->
    <v-row justify="center" class="mb-4">
      <v-col cols="12" class="text-center">
        <h2 class="text-h5 font-weight-bold">📷 QR Code Scanner</h2>
        <div class="text-subtitle-2 text--secondary">
          Point your camera at a QR code to scan
        </div>
      </v-col>
    </v-row>

    <!-- Action Button -->
    <v-row justify="center">
      <v-col cols="12" sm="8">
        <v-btn
          block
          color="primary"
          class="mb-3"
          large
          :loading="loading"
          @click="toggleScanner"
        >
          <v-icon left>mdi-qrcode-scan</v-icon>
          {{ isScanning ? 'Stop Scanning' : 'Start Scanning' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Scanner Container -->
    <v-row justify="center">
      <v-col cols="12" sm="8">
        <v-sheet
          elevation="2"
          rounded
          class="pa-4"
          style="background-color: #1e1e1e; min-height: 300px;"
        >
          <div id="qr-reader" style="width: 100%; height: 100%;"></div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Status Message -->
    <v-row justify="center" class="mt-4">
      <v-col cols="12" sm="8">
        <v-alert
          v-if="status"
          :type="alertType"
          dense
          outlined
          border="left"
        >
          {{ status }}
          <v-btn
            v-if="showRetry"
            text
            small
            color="warning"
            class="ml-2"
            @click="initScanner"
          >
            Retry
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    html5QrCode: null,
    isScanning: false,
    loading: false,
    status: '',
    alertType: 'info',
    showRetry: false
  }),

  async mounted() {
    await this.loadLibrary()
  },

  beforeDestroy() {
    this.cleanupScanner()
  },

  methods: {
    async loadLibrary() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        window.Html5Qrcode = Html5Qrcode
      } catch (err) {
        this.setStatus('Failed to load scanner library', 'error', true)
      }
    },

    async toggleScanner() {
      this.isScanning ? this.stopScanner() : await this.initScanner()
    },

    async initScanner() {
      this.loading = true
      this.setStatus('Initializing scanner...', 'info')

      try {
        await this.testCameraAccess()
        this.html5QrCode = new window.Html5Qrcode("qr-reader")

        await this.html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          this.handleScan,
          () => {}
        )

        this.isScanning = true
        this.setStatus('Scanner ready. Point at a QR code.', 'success')
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    },

    async testCameraAccess() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      stream.getTracks().forEach(track => track.stop())
    },

    handleScan(decodedText) {
      this.setStatus(`Scanned: ${decodedText}`, 'success')
      this.$emit('scanned', decodedText)
    },

    handleError(err) {
      console.error('Scanner error:', err)
      let message = 'Scanner error occurred'

      if (err.name === 'NotAllowedError') {
        message = 'Camera access denied. Please check permissions.'
      } else if (err.name === 'NotFoundError') {
        message = 'No camera detected.'
      } else if (err.message.includes('Requested device not found')) {
        message = 'Camera not found. Try another device.'
      } else {
        message = err.message || 'Unknown error.'
      }

      this.setStatus(message, 'error', true)
      this.cleanupScanner()
    },

    setStatus(text, type, showRetry = false) {
      this.status = text
      this.alertType = type
      this.showRetry = showRetry
    },

    async stopScanner() {
      if (this.html5QrCode) {
        try {
          await this.html5QrCode.stop()
          this.setStatus('Scanner stopped.', 'info')
        } catch (err) {
          console.warn('Error stopping scanner:', err)
        }
      }
      this.cleanupScanner()
    },

    cleanupScanner() {
      this.isScanning = false
      this.html5QrCode = null
      const el = document.getElementById('qr-reader')
      if (el) el.innerHTML = ''
    }
  }
}
</script>

<style scoped>
.text-subtitle-2 {
  opacity: 0.7;
}
</style>
