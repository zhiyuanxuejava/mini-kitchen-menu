<template>
  <image
    :class="imageClass"
    :src="currentSrc"
    :mode="mode"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { icons } from '@/data/assets'

const props = withDefaults(defineProps<{
  src?: string
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
  imageClass?: string
}>(), {
  src: '',
  mode: 'aspectFill',
  imageClass: ''
})

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  }
)

const currentSrc = computed(() => {
  if (failed.value || !props.src) return icons.avatar
  return props.src
})

function handleError() {
  failed.value = true
}
</script>
