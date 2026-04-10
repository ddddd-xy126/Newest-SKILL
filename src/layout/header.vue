<template>
  <div class="header">
    <!-- 左侧：Logo/标题 -->
    <div class="header-left">
      <h1 class="logo">监狱管理局数字化智慧运维平台</h1>
    </div>

    <!-- 中部：路由导航 -->
    <div class="header-nav">
      <NavItem
        v-for="item in navList"
        :key="item.id"
        :item="item"
        @jumpNav="handleNavClick"
      />
    </div>

    <!-- 右侧：功能按钮区 -->
    <div class="header-right">
      <div
        v-for="btn in rightBtns"
        :key="btn.id"
        class="right-btn"
        :class="{ active: btn.isActive }"
        @click="handleRightBtnClick(btn)"
      >
        <img
          class="right-btn-bg"
          :src="btn.isActive ? activeImg : nomalImg"
          alt=""
        />
        <span class="right-btn-text">{{ btn.name }}</span>
      </div>
      <span class="right-label">监狱管理局</span>
      <span class="right-lang">中文<br/>EN</span>
      <span class="right-separator"></span>
      <div class="right-icon-btn"> 
      </div>
    </div>
  </div>
</template>

<script>
import NavItem from "@/components/header/navItem-header.vue";

export default {
  name: "Header",
  components: {
    NavItem,
  },
  data() {
    return { 
      navList: [
        { id: 1, name: "综合态势", path: "/page_1/1", pathPrefix: "/page_1", isActive: false },
        { id: 2, name: "综合安防", path: "/page_2/1", pathPrefix: "/page_2", isActive: false },
        { id: 3, name: "便捷通行", path: "/page_3/1", pathPrefix: "/page_3", isActive: false },
        { id: 4, name: "能效管理", path: "/page_4/1", pathPrefix: "/page_4", isActive: false },
        { id: 5, name: "设施管理", path: "/page_5/1", pathPrefix: "/page_5", isActive: false },
        { id: 6, name: "环境空间", path: "/page_6/1", pathPrefix: "/page_6", isActive: false },
        { id: 7, name: "资产管理", path: "/page_7/1", pathPrefix: "/page_7", isActive: false },
        { id: 8, name: "办公会议", path: "/page_8/1", pathPrefix: "/page_8", isActive: false },
        { id: 9, name: "应急管理", path: "/page_9/1", pathPrefix: "/page_9", isActive: false },
        { id: 10, name: "网络管理", path: "/page_10/1", pathPrefix: "/page_10", isActive: false },
      ],
      rightBtns: [
        { id: 1, name: "主页", isActive: true },
        { id: 2, name: "智能预警大脑", isActive: false },
        { id: 3, name: "AI数字人", isActive: false },
      ],
    };
  },
  watch: {
    "$route.path": {
      handler(newPath) {
        this.navList.forEach((item) => {
          item.isActive = newPath.startsWith(item.pathPrefix);
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleNavClick(item) {
      if (this.$route.path !== item.path) {
        this.$router.push(item.path);
      }
    },
    handleRightBtnClick(btn) {
      this.rightBtns.forEach((b) => {
        b.isActive = b.id === btn.id;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("~@images/layout/top.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/* 左侧标题 */
.header-left {
  position: absolute;
  left: 1.1%;
  top: 0;
  height: 55%;
  display: flex;
  align-items: center;
  min-width: 300px;
}

.logo {
  line-height: 1;
  letter-spacing: 0.05em;
  font-family: var(--font-family-primary-Bold);
  font-size: var(--font-size-24);
  color: #d9f3ff;
  text-shadow: 0 0 10px rgba(49, 174, 255, 0.6);
  white-space: nowrap;
}

/* 中部导航 */
.header-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5%;
  height: 45%;
  display: flex;
  background-image: url("~@images/layout/nav-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  align-items: center;
  gap: 0.2rem;
}

/* 右侧按钮区 */
.header-right {
  position: absolute;
  right: 1.1%;
  top: 0;
  height: 50%;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.right-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0 0.8rem;
  height: 70%;

  .right-btn-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .right-btn-text {
    position: relative;
    z-index: 1;
    color: rgba(192, 220, 231, 0.85);
    font-family: var(--font-family-primary-Regular);
    font-size: var(--font-size-12);
    white-space: nowrap;
  }

  &.active .right-btn-text {
    color: #ffffff;
    font-family: var(--font-family-primary-Bold);
  }
}

.right-label {
  color: rgba(192, 220, 231, 0.85);
  font-family: var(--font-family-primary-Regular);
  font-size: var(--font-size-12);
  white-space: nowrap;
}

.right-lang {
  color: rgba(192, 220, 231, 0.85);
  font-family: var(--font-family-primary-Regular);
  font-size: var(--font-size-10);
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}

.right-icon-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0 0.2rem;

  .icon-img {
    height: 1.2rem;
    width: auto;
  }
}

.right-separator {
  display: inline-block;
  width: 1px;
  height: 0.9rem;
  background: rgba(192, 220, 231, 0.3);
  margin: 0 0.1rem;
}
</style>
