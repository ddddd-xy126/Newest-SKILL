<!--
  403权限不足页面组件
  
  功能说明:
  1. 显示权限不足的友好提示
  2. 提供返回首页和联系管理员的操作
  3. 适配大屏显示风格
  
  @author Hua<51world>
-->
<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标和代码 -->
      <div class="error-icon">
        <div class="error-number">403</div>
        <div class="error-text">权限不足</div>
      </div>
      
      <!-- 错误描述 -->
      <div class="error-description">
        <h2>抱歉，您没有访问此页面的权限</h2>
        <p>请联系系统管理员获取相应权限，或返回您有权限访问的页面</p>
      </div>
      
      <!-- 权限信息 -->
      <div class="permission-info" v-if="userInfo">
        <div class="user-info">
          <span class="label">当前用户:</span>
          <span class="value">{{ userInfo.username || '游客' }}</span>
        </div>
        <div class="role-info">
          <span class="label">用户角色:</span>
          <span class="value">{{ userRoles.join(', ') || '无' }}</span>
        </div>
        <div class="required-info">
          <span class="label">所需权限:</span>
          <span class="value">{{ requiredRoles.join(', ') || '未知' }}</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="error-actions">
        <el-button 
          type="primary" 
          size="large" 
          @click="goHome"
          class="home-btn"
        >
          <i class="el-icon-house"></i>
          返回首页
        </el-button>
        
        <el-button 
          size="large" 
          @click="goBack"
          class="back-btn"
        >
          <i class="el-icon-back"></i>
          返回上页
        </el-button>
        
        <el-button 
          type="warning" 
          size="large" 
          @click="contactAdmin"
          class="contact-btn"
        >
          <i class="el-icon-service"></i>
          联系管理员
        </el-button>
      </div>
      
      <!-- 装饰性元素 -->
      <div class="error-decoration">
        <div class="floating-element element-1"></div>
        <div class="floating-element element-2"></div>
        <div class="floating-element element-3"></div>
        <div class="floating-element element-4"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error403',
  
  data() {
    return {
      userInfo: null,
      userRoles: [],
      requiredRoles: []
    }
  },
  
  mounted() {
    // 设置页面标题
    document.title = '权限不足 - 数据可视化大屏';
    
    // 获取用户信息
    this.getUserInfo();
    
    // 获取所需权限信息
    this.getRequiredPermissions();
    
    // 记录403访问日志
    console.warn('403权限不足访问:', {
      path: this.$route.fullPath,
      user: this.userInfo,
      timestamp: new Date().toISOString()
    });
  },
  
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfo() {
      // 从 store 或 localStorage 获取用户信息
      this.userInfo = this.$store.getters.userInfo || 
                     JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.userRoles = this.userInfo.roles || ['guest'];
    },
    
    /**
     * 获取所需权限信息
     */
    getRequiredPermissions() {
      // 从路由 meta 信息获取所需权限
      const fromRoute = this.$route.query.from;
      if (fromRoute) {
        // 可以根据来源路由获取权限要求
        this.requiredRoles = ['admin', 'manager']; // 示例
      }
    },
    
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
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push('/');
      }
    },
    
    /**
     * 联系管理员
     */
    contactAdmin() {
      this.$message({
        message: '请联系系统管理员: admin@example.com',
        type: 'info',
        duration: 5000,
        showClose: true
      });
      
      // 也可以打开邮件客户端或显示联系方式弹窗
      // window.open('mailto:admin@example.com?subject=权限申请&body=申请访问页面: ' + this.$route.fullPath);
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
  background: linear-gradient(135deg, #2c1810 0%, #3d2317 50%, #2c1810 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.error-container {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 700px;
  padding: 2rem;
}

.error-icon {
  margin-bottom: 2rem;
  
  .error-number {
    font-size: 8rem;
    font-weight: bold;
    background: linear-gradient(45deg, #FF6B35, #F7931E);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
    margin-bottom: 1rem;
    font-family: var(--font-family-primary-Bold);
  }
  
  .error-text {
    font-size: var(--font-size-32);
    color: var(--color-primary);
    font-family: var(--font-family-primary-Medium);
    text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
  }
}

.error-description {
  margin-bottom: 2rem;
  
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

.permission-info {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
  
  .user-info,
  .role-info,
  .required-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      font-size: var(--font-size-16);
      color: var(--color-secondary);
      font-family: var(--font-family-primary-Regular);
    }
    
    .value {
      font-size: var(--font-size-16);
      color: var(--color-primary);
      font-family: var(--font-family-primary-Medium);
    }
  }
  
  .required-info .value {
    color: #FF6B35;
  }
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  .el-button {
    padding: 12px 20px;
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
    
    &.contact-btn {
      background: linear-gradient(45deg, #FF6B35, #F7931E);
      border: none;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
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
  background: linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
  animation: float 8s ease-in-out infinite;
  
  &.element-1 {
    width: 80px;
    height: 80px;
    top: 15%;
    left: 8%;
    animation-delay: 0s;
  }
  
  &.element-2 {
    width: 120px;
    height: 120px;
    top: 70%;
    right: 10%;
    animation-delay: 2s;
  }
  
  &.element-3 {
    width: 60px;
    height: 60px;
    bottom: 25%;
    left: 15%;
    animation-delay: 4s;
  }
  
  &.element-4 {
    width: 100px;
    height: 100px;
    top: 40%;
    right: 25%;
    animation-delay: 6s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-25px) rotate(180deg);
    opacity: 0.5;
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
  
  .permission-info {
    .user-info,
    .role-info,
    .required-info {
      flex-direction: column;
      gap: 0.3rem;
    }
  }
}
</style>