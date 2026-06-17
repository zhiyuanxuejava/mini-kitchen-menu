<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useKitchenStore } from '@/stores/kitchen'
import { setupWechatPrivacy } from '@/utils/wechat-privacy'
import { startVersionCheck } from '@/utils/version-check'

onLaunch(() => {
  useKitchenStore().hydrate()
  setupWechatPrivacy()
  startVersionCheck()
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  min-height: 100%;
  background: $page-bg;
  color: $text-main;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow-x: hidden;
}

view,
text,
uni-text,
button,
uni-button,
input,
textarea {
  box-sizing: border-box;
}

button,
uni-button {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: normal;
  min-width: 0;
  white-space: nowrap;
  text-align: center;
}

button::after,
uni-button::after {
  border: 0;
}
</style>
