<template>
    <!--ref/children   -->
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <slot></slot>
      </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
        name:'Scroll',
        props: {
          probeType: {
            type:Number,
            default: 0
          },
          pullUpLoad: {
            type:Boolean,
            default: false
          }
        },
        data() {
          return {
            scroll:null
          }
        },
        mounted() {
          // 1.创建BSscroll对象
          this.scroll = new BScroll(this.$refs.wrapper, {
            click:true,
            // 根据有没传入这个值来决定是否实时监听
            probeType: this.probeType,
            pullUpLoad: this.pullUpLoad
          })

          // 2.监听滚动的位置
          this.scroll.on('scroll', (position) => {
            // console.log(position);
            // 发送自定义事件
            this.$emit('scroll', position)
          })

          // 3.监听上拉加载事件
          this.scroll.on('pullingUp', () => {
            // console.log('上拉加载更多');
            // 发送自定义事件
            this.$emit('pullingUp')
          })
        },
        methods: {
          scrollTo(x, y, time=500) {
            this.scroll && this.scroll.scrollTo(x, y, time)
          },
          refresh() {
            this.scroll && this.scroll.refresh()
          },
          finishPullUp() {
            this.scroll.finishPullUp()
          },
        }
    }

</script>

<style scoped>

</style>