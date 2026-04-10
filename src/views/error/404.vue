<!--
  404错误页面组件
  
  功能说明:
  1. 显示页面不存在的友好提示
  2. 提供返回首页的操作按钮
  3. 适配大屏显示风格
  
  @author Hua<51world>
-->
<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标和代码 -->
      <div class="error-icon">
        <div class="error-number">404</div>
        <div class="error-text">页面不存在</div>
      </div>

      <!-- 错误描述 -->
      <div class="error-description">
        <h2>抱歉，您访问的页面不存在</h2>
        <p>可能是网址输入错误，或者页面已被删除或移动</p>
      </div>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <el-button type="primary" size="large" @click="goHome" class="home-btn">
          <i class="el-icon-house"></i>
          返回首页
        </el-button>

        <el-button size="large" @click="goBack" class="back-btn">
          <i class="el-icon-back"></i>
          返回上页
        </el-button>
      </div>

      <!-- 装饰性元素 -->
      <div class="error-decoration">
        <div class="floating-element element-1"></div>
        <div class="floating-element element-2"></div>
        <div class="floating-element element-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',

  data() {
    return {
      // 可以添加一些统计数据
    }
  },

  mounted() {
    // 设置页面标题
    document.title = '页面不存在 - 数据可视化大屏';

    // 记录404访问日志
    console.warn('404页面访问:', this.$route.fullPath);
  },

  methods: {
    /**
     * 返回首页
     */
    goHome() {
      this.$router.push('/');
    },

    /**
     * 返回上一页
     */
    goBack() {
      // 如果有历史记录则返回，否则跳转到首页
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push('/');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.error-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0c1426 0%, #1a2332 50%, #0c1426 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.error-container {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 600px;
  padding: 2rem;
}

.error-icon {
  margin-bottom: 2rem;

  .error-number {
    font-size: 8rem;
    font-weight: bold;
    background: linear-gradient(45deg, #31AEFF, #00D4FF);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 30px rgba(49, 174, 255, 0.5);
    margin-bottom: 1rem;
    font-family: var(--font-family-primary-Bold);
  }

  .error-text {
    font-size: var(--font-size-32);
    color: var(--color-primary);
    font-family: var(--font-family-primary-Medium);
    text-shadow: var(--text-shadow-blue);
  }
}

.error-description {
  margin-bottom: 3rem;

  h2 {
    font-size: var(--font-size-28);
    color: var(--color-primary);
    margin-bottom: 1rem;
    font-family: var(--font-family-primary-Medium);
  }

  p {
    font-size: var(--font-size-20);
    color: var(--color-secondary);
    line-height: 1.6;
    font-family: var(--font-family-primary-Light);
  }
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  .el-button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: var(--font-size-16);
    font-family: var(--font-family-primary-Medium);
    transition: all 0.3s ease;

    &.home-btn {
      background: linear-gradient(45deg, #31AEFF, #00D4FF);
      border: none;
      box-shadow: 0 4px 15px rgba(49, 174, 255, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(49, 174, 255, 0.4);
      }
    }

    &.back-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--color-primary);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
    }
  }
}

.error-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(49, 174, 255, 0.1), rgba(0, 212, 255, 0.1));
  animation: float 6s ease-in-out infinite;

  &.element-1 {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &.element-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  &.element-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.6;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .error-container {
    padding: 1rem;
  }

  .error-icon .error-number {
    font-size: 6rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>