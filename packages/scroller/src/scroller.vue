<template>
  <div
    class="mn-scroller"
    :class="{ 'is-hide-bar': !scrollbar }"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
    @scroll="scroll">
    <div class="mn-scroller-contents">
      <!-- scroller contents -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Scrollers from './Scrollers'

  /**
   * Scrollers instance to save scrollers.
   */
  const scrollers = new Scrollers()

  /**
   * Scroller component
   */
  export default {
    name: 'mn-scroller',
    props: {
      /**
       * Do scroller save the top scroll value
       */
      save: {
        type: Boolean,
        default: true
      },
      /**
       * The scroller name.
       * if have two scroller in one page, you need set thier name.
       */
      name: {
        type: String,
        default: 'default'
      },
      /**
       * Save mode.
       * full only include path,
       * fullPath include path and string query
       */
      mode: {
        type: String,
        default: 'path',
        validator: val => ['path', 'fullPath'].includes(val)
      },
      /**
       * Show scrollbar
       */
      scrollbar: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        /**
         * @todo remove
         */
        time: undefined,
        createdScrollTop: false
      }
    },
    methods: {
      touchStart (event) {
        // Save origin pageX and pageY in touchStart
        this.startPageY = event.touches[0].pageY
        this.startPageX = event.touches[0].pageX

        /**
         * @event touchstart
         * @property {Event} event - DOM Event
         * @property {VueComponent} scroller - scroller self
         */
        this.$emit('touchstart', event, this)
      },
      touchMove (event) {
        let pageY = event.touches[0].pageY
        let scrollTop = this.$el.scrollTop
        let scrollHeight = this.$el.scrollHeight
        let containerHeight = this.$el.offsetHeight

        // If startPageX is too low,
        // allow swipe to right to emit browser back event.
        if (this.startPageX > 16) {
          // prevent top scroll less than 0, case in safari or wechat browser.
          if (pageY > this.startPageY && scrollTop <= 0) {
            event.preventDefault()
          }

          // prevent top scroll great than container height, case in safari or wechat browser.
          if (pageY < this.startPageY && scrollTop >= scrollHeight - containerHeight) {
            event.preventDefault()
          }
        }

        /**
         * @event touchmove
         * @property {Event} event - DOM Event
         * @property {VueComponent} scroller - scroller self
         */
        this.$emit('touchmove', event, this)
      },
      touchEnd (event) {
        this.scrollAndTouchEnd(event)

        /**
         * @event touchend
         * @property {Event} event - DOM Event
         * @property {VueComponent} scroller - scroller self
         */
        this.$emit('touchend', event, this)
      },
      scroll (event) {
        this.scrollAndTouchEnd(event)

        /**
         * @event scroll
         * @property {Event} event - DOM Event
         * @property {VueComponent} scroller - scroller self
         */
        this.$emit('scroll', event, this)
      },
      scrollAndTouchEnd (event) {
        this.saveScrollTop()

        // pull to the scroller top
        if (this.$el.scrollTop <= 0) {
          /**
           * @event top
           * @property {Event} event - DOM Event
           * @property {VueComponent} scroller - scroller self
           */
          this.$emit('top', event, this)
        }

        // push to the scroller bottom
        if (this.$el.offsetHeight >= this.$el.scrollHeight - this.$el.scrollTop) {
          /**
           * @event bottom
           * @property {Event} event - DOM Event
           * @property {VueComponent} scroller - scroller self
           */
          this.$emit('bottom', event, this)
        }
      },
      getRoutePath () {
        return this.$route[this.mode]
      },
      createScrollTop () {
        // The method will be exec in mounted hook.
        // Check the app install `vue-router`,
        // and allow to save the top scroll value.
        if (!this.$route || !this.save) return
        // Get scroller top from share state, and give the value to the scroller.
        this.$el.scrollTop = scrollers.getScroller(this.getRoutePath(), this.name).top
        // Set createdScrollTop is true,
        // In order to tell the scroller: the scrollTop complete initialization.
        // After initialization, the scroller can save new scrollTop value.
        this.createdScrollTop = true
      },
      saveScrollTop () {
        // Check the app install `vue-router`,
        // and allow to save the top scroll value.
        // And the scrollTop after initialization, it can save new value.
        if (!this.$route || !this.save || !this.createdScrollTop) return
        // Save new scrollTop value.
        scrollers.addScroller(this.getRoutePath(), this.name, this.$el.scrollTop)
      }
    },
    mounted () {
      // Execute createScrollTop method after a lot millisecond.
      // Because wait the app page load thier DOM.
      this.$nextTick(() => {
        setTimeout(this.createScrollTop, 100)
      })
    }
  }
</script>
