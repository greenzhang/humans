<template>
  <div class="mn-card" :class="{
    [`is-${theme}`]: !!theme,
    'is-rounded': rounded,
    'is-backdrop': enableBackdrop
  }">
    <!-- show card contents -->
    <slot></slot>
  </div>
</template>

<script>
  /**
   * Card component
   */
  export default {
    name: 'mn-card',
    props: {
      /**
       * Card theme, inset value: 'inverse' or 'glass'.
       */
      theme: String,
      /**
       * Force to render rounded border.
       */
      rounded: Boolean
    },
    data () {
      return {
        /**
         * is window support '-webkit-backdrop-filter'
         * @todo sperate this data and mounted method into shared mixin file.
         */
        enableBackdrop: false
      }
    },
    mounted () {
      if (document.body.style.hasOwnProperty('webkitBackdropFilter')) {
        this.enableBackdrop = true
      }
    }
  }
</script>
