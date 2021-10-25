<template>
  <div class="progress-bar"
       @click="onClick">
    <!-- 进度条 -->
    <div class="bar-inner">
      <!-- 黄色进度 -->
      <div class="progress"
           ref="progress"
           :style="progressStyle"></div>
      <!-- 按钮 -->
      <div class="progress-btn-wrapper"
           :style="btnStyle"
           @touchstart.prevent="onTouchStart"
           @touchmove.prevent="onTouchMove"
           @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16

  export default {
    name: 'progress-bar',
    emits: ['progress-changing', 'progress-changed'],
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        offset: 0
      }
    },
    computed: {
      progressStyle () {
        return `width: ${this.offset}px`
      },
      btnStyle () {
        return `transform: translate3d(${this.offset}px, 0, 0)`
      }
    },
    watch: {
      // 监听进度条进度
      progress(newProgress) {
        // 调用函数
        this.setOffset(newProgress)
      }
    },
    created () {
      // touch是不需要观察变化的数据，但要在上下文中使用到它，所以放created生命周期里
      // touch不放data，是避免性能浪费，这里不需要定成响应式，随着模板重新加载
      this.touch = {}
    },
    methods: {
      // 拖动开始，获取默认位置
      onTouchStart (e) {
        this.touch.x1 = e.touches[0].pageX
        // 黄色进度条的初始宽度
        this.touch.beginWidth = this.$refs.progress.clientWidth
      },
      // 拖动过程，实时监听派发的进度条的进度
      onTouchMove (e) {
        // 偏移
        const delta = e.touches[0].pageX - this.touch.x1
        // 位移后的宽度
        const tempWidth = this.touch.beginWidth + delta
        // 进度条的宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 两者相除，得到进度
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
        // 进度 * 总长 = 偏移位置
        this.offset = progress * barWidth
        this.$emit('progress-changing', progress)
      },
      // 拖动结束，派发进度条的进度
      onTouchEnd () {
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 进度 = 黄色进度条宽度 / 总长度
        const progress = this.$refs.progress.clientWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      // 点击进度条
      onClick (e) {
        // 进度条相对于视口的位置
        const rect = this.$el.getBoundingClientRect()
        // 偏移位置 = 点击的位置 - 进度条视口距离左侧的位置
        const offsetWidth = e.pageX - rect.left
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = offsetWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      // 监听进度条进度
      setOffset (progress) {
        // 进度条的宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 进度 * 总长 = 偏移位置
        this.offset = barWidth * progress
      }
    }
  }
</script>

<style scoped lang="scss">
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
