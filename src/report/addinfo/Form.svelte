<script>
  import { envDetailsInStore } from '../store.js'
  
  let screenSize = $state(getScreenSize())
  let browserType = $state(getBrowserType())

  $effect(() => {
    envDetailsInStore.value =
      'Screen size: ' + screenSize + '\nBrowser type: ' + browserType
  })

  function updateEnvDetailsInStore() {
    envDetailsInStore.value =
      'Screen size: ' + screenSize + '\nBrowser type: ' + browserType
  }

  function getScreenSize() {
    return `${window.innerWidth}px x ${window.innerHeight}px`
  }

  function getBrowserType() {
    const test = (regexp) => {
      return regexp.test(navigator.userAgent)
    }

    if (test(/opr\//i) || !!window.opr) {
      return 'Opera'
    } else if (test(/edg/i)) {
      return 'Microsoft Edge'
    } else if (test(/chrome|chromium|crios/i)) {
      return 'Google Chrome'
    } else if (test(/firefox|fxios/i)) {
      return 'Mozilla Firefox'
    } else if (test(/safari/i)) {
      return 'Apple Safari'
    } else if (test(/trident/i)) {
      return 'Microsoft Internet Explorer'
    } else if (test(/ucbrowser/i)) {
      return 'UC Browser'
    } else if (test(/samsungbrowser/i)) {
      return 'Samsung Browser'
    } else {
      return 'Unknown browser'
    }
  }

  window.addEventListener('resize', () => {
    screenSize = getScreenSize()
    updateEnvDetailsInStore()
  })
</script>