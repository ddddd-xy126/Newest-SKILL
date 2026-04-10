<template>
  <transition :name="`slide-${position}`">
    <div class="box" v-if="isShow" :style="{ 'margin-bottom': footerBoxStyle['margin-bottom'] || '3%' }">
      <!-- minimal: 无头部 -->
      <template v-if="type !== 'minimal'">
        <!-- default: 完全 slot 控制（向后兼容） -->
        <div class="header-container" v-if="type === 'default'">
          <div class="box-header-left">
            <div class="box-sub-header">
              <header class="box-header" :style="{ width: footerBoxStyle['width'] || '65%' }">
                <slot name="header"></slot>
              </header>
              <header class="box-header-en">
                <slot name="header-en"></slot>
              </header>
            </div>
          </div>
          <header class="box-header-right">
            <slot name="header-right"></slot>
          </header>
        </div>

        <!-- compact: icon + title/subtitle 水平排列 + header-right -->
        <div class="header-container" v-else-if="type === 'compact'">
          <div class="box-header-left">
            <slot name="header-icon"></slot>
            <div class="box-title-group box-title-group--horizontal">
              <h1 class="box-title">{{ title }}</h1>
              <span class="box-subtitle" v-if="subtitle">{{ subtitle }}</span>
            </div>
          </div>
          <header class="box-header-right">
            <slot name="header-right"></slot>
          </header>
        </div>

        <!-- banner: icon + title/subtitle 上下堆叠 + header-right -->
        <div class="header-container" v-else-if="type === 'banner'">
          <div class="box-header-left">
            <slot name="header-icon"></slot>
            <div class="box-title-group box-title-group--vertical">
              <h1 class="box-title">{{ title }}</h1>
              <span class="box-subtitle" v-if="subtitle">{{ subtitle }}</span>
            </div>
          </div>
          <header class="box-header-right">
            <slot name="header-right"></slot>
          </header>
        </div>

        <!-- simple: icon + title -->
        <div class="header-container" v-else-if="type === 'simple'">
          <div class="box-header-left">
            <slot name="header-icon"></slot>
            <h1 class="box-title">{{ title }}</h1>
          </div>
        </div>
      </template>

      <main class="box-main">
        <div class="box-tag" v-if="tag !== ''">
          <span class="tag">{{ tag }}</span>
        </div>
        <slot></slot>
      </main>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "default",
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "",
    },
    delayTime: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: "",
    },
    footerBoxStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  name: "box",
  data() {
    return {
      isShow: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.isShow = true;
    }, this.delayTime);
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;
    margin: 0;
    height: 3.125rem;
    padding-bottom: 0.2rem;
    background-image: url("~@images/layout/box-header.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .box-sub-header {
    }
  }
}

.box-header-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 0.5rem;
  padding-left: 10%;

  img {
    width: 1.75rem;
    height: 1.75rem;
    margin-right: 0.6rem;
  }
}

.box-header-en {
  margin-top: -0.6rem;
}

.box-header-right {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.box-title {
  color: #d9f3ff;
  font-family: var(--font-family-primary-Bold);
  font-size: var(--font-size-18);
  white-space: nowrap;
}

.box-subtitle {
  color: rgba(192, 220, 231, 0.6);
  font-size: var(--font-size-12);
  white-space: nowrap;
}

.box-title-group--horizontal {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.box-title-group--vertical {
  display: flex;
  flex-direction: column;
}

.box-main {
  border: none;
  padding: 1.05rem 1.1rem;
  position: relative;
  height: calc(100% - 3.125rem);

  .box-tag {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(16, 54, 85, 0.85);
    padding: 0.2rem 0.6rem;
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter {
  transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter {
  transform: translateX(100%);
}
</style>
