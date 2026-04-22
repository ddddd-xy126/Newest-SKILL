<style lang="scss" scoped>
.nav-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding: 0 0.6rem;
}

.bgImg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.nav-text {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 0.5rem;
  white-space: nowrap;

  span {
    color: rgba(192, 220, 231, 0.85);
    font-family: var(--font-family-primary-Regular);
    font-size: var(--font-size-16);
  }

  &:hover span {
    color: #ffffff;
  }

  &.active span {
    color: #ffffff;
    font-family: var(--font-family-primary-Bold);
  }
}
</style>

<template>
  <div class="nav-item-container" @click="navClickEvent(item)">
    <div :class="['nav-text', { active: item.isActive }]">
      <span>{{ item.name }}</span>
    </div> 
  </div>
</template>

<script>
export default {
  name: "FrontEndNavItem",
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: "-",
          id: 1,
          isActive: false,
          path: "",
        };
      },
    },
  },
  methods: {
    navClickEvent(e) {
      this.$emit("jumpNav", e);
    },
  },
};
</script>
