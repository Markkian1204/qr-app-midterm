import Vue from 'vue'

Vue.prototype.$getHtml5Qrcode = async () => {
  const { Html5Qrcode } = await import('html5-qrcode')
  return Html5Qrcode
}
