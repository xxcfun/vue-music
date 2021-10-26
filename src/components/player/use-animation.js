import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation (el, done) {
  const cdWrapperRef = ref(null)
  // 声明两个标记位
  let entering = false
  let leaving = false

  function enter () {
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()

    // 创建动画效果
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }

    // 用animations注册这个动画实列
    animations.registerAnimation({
      // 动画名称
      name: 'move',
      // 动画
      animation,
      // 预设项
      presets: {
        // 持续时间
        duration: 600,
        // 时间函数
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })

    // 运行动画。第一个参数，dom。第二个是动画名，第三个是动画执行完的回调函数，这里使用enter钩子函数第二个默认参数done
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter () {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animate = ''
  }

  function leave (el, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEL = cdWrapperRef.value

    // 添加动画css
    cdWrapperEL.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEL.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    // 监听事件
    cdWrapperEL.addEventListener('transitionend', next)

    function next () {
      cdWrapperEL.removeEventListener('transitionend', next)
      done()
    }
  }

  function afterLeave () {
    leaving = false
    const cdWrapperEL = cdWrapperRef.value
    cdWrapperEL.style.transition = ''
    cdWrapperEL.style.transform = ''
  }

  function getPosAndScale () {
    // 目标圆宽度
    const targetWidth = 40
    // 目标圆心位置距离屏幕的距离
    const paddingLeft = 40
    const paddingBottom = 30
    // 大圆心距离屏幕顶部的距离
    const paddingTop = 80
    // 大圆宽度
    const width = window.innerWidth * 0.8
    // 计算偏移量
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
