<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
      <scroll class="content" ref="scroll" @scroll="contentScroll"
      :probe-type="3">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="this.goods"></detail-base-info>
        <detail-shop-info :shop="this.shop"></detail-shop-info>
        <detail-goods-info :detailInfo="this.detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo" ref="params"/>
        <detail-comment-info :comment-info="commentInfo" ref="comments">
        </detail-comment-info>
        <goods-list :goods="recommends" ref="recommends" ></goods-list>
      </scroll>
      <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
      <!-- <toast :message="message" :show="show"></toast> -->
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DeatilCommentInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'
    // import DetailRecommendInfo from './childComps/DetailRecommendInfo'

    import GoodsList from 'components/content/goods/GoodsList'
    import Scroll from 'components/common/scroll/Scroll'
    import BackTop from 'components/content/backTop/BackTop'

    import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
    // import {debounce} from 'common/utils'
    import {itemListenerMixin} from 'common/mixin'
    import {debounce} from 'common/utils'

    import { mapActions } from 'vuex'

    // toast组件
    // import Toast from 'components/common/toast/toast'

  

    export default {
        name:'Detail',
        components: {
          DetailNavBar,
          DetailSwiper,
          DetailBaseInfo,
          DetailShopInfo,
          Scroll,
          DetailGoodsInfo,
          DetailParamInfo,
          DetailCommentInfo,
          // DetailRecommendInfo
          GoodsList,
          DetailBottomBar,
          BackTop,
          // Toast
        },
        mixins:[itemListenerMixin],
        data() {
          return {
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommends:[],
            themeTopYs:[],
            getThemeTopY:null,
            currentIndex:0,
            isShowBackTop: false,
            // message:'',
            // show:false
          }
        },
        created() {
          // 1.保存传入的iid
          this.iid = this.$route.params.iid

          // 2.根据iid请求详情数据
          getDetail(this.iid).then(res => {
            //1.获取顶部的图片轮播数据
            const data = res.result;
            this.topImages = res.result.itemInfo.topImages

            // 2.获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services) 

            // 3.创建店铺信息的对象
            this.shop = new Shop(data.shopInfo)

            // 4.保存商品的详情数据
            this.detailInfo = data.detailInfo;

            // 5.获取参数的信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

            // 6.取出评论的信息
            if (data.rate.cRate !== 0) {
              this.commentInfo = data.rate.list[0]
            }

            //  this.$nextTick(() => {
            //   //  根据最新的数据，对应的DOM是已经被渲染出来了
            //   // 但是图片依然是没有加载完的
            //   this.themeTopYs = []

            //   this.themeTopYs.push(0);
            //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            //   this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
            //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)

            //   console.log(this.themeTopYs)


        })
          // 3.请求推荐数据
          getRecommend().then(res => {
            this.recommends = res.data.list
          }) 

          // 4.给getThemeTopY
          this.getThemeTopY = debounce(() => {

            this.themeTopYs = []
            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
            this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)

            console.log(this.themeTopYs);
          }, 500)
        },
        mounted() {
          // console.log('111')
        },
        destroyed() {
          this.$bus.$off('itemImgLoad' , this.itemImgListener)
        },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },
      contentScroll(position) {
        // console.log(position)
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY和主题中的值进行对比
        // positionY 在 0 和 7938之间 index= 0 
        // positionY 在 7938 和 9120 之间 index= 1
        // positionY 在 9120 和 9452 之间 index= 2
        // positionY 在超过0120 index= 3

        let length = this.themeTopYs.length
        for (let i=0; i < length; i++) {
          // if(positionY > this.themeTopYs[parseInt(i)] && positionY < this.themeTopYs[i+1]) {
          //   console.log(i)
          // }

          // 不一致的情况下在进入其中判断条件
          if(this.currentIndex !== i && ((i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) 
          || 
          (i === length -1 && positionY > this.themeTopYs[i])))
          {

            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex

          }   
          // 3.是否显示回到顶部
          this.isShowBackTop = (-position.y) > 1000
        }
      },
      backClick() {
          // 通过ref拿到组件对象
          this.$refs.scroll.scrollTo(0,0)
        },
      addToCart() {
        // console.log('----')
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title;
        product.desc = this.goods.desc
        product.price = this.goods.realPrice

        product.iid = this.iid 

        // 2.将商品添加到购物车里(1.返回promise, 2.mapActions)
        // this.$store.cartList.
        // this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product).then(res => {
          // 使用Toast组件
          // this.show = true;
          // this.message = res;

          // setTimeout(() => {
          //   this.show = false
          // },1500)
          this.$toast.show(res, 2000)
        })

      }
    }
  }

</script>

<style  scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 49px );
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>