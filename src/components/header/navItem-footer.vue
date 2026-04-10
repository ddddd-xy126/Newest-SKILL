<style lang="scss" scoped>
.nav-item-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;


    .item {
        width: 100%;
        height: 100%;
        background-image: url(~@images/nav/footer_nor.png);
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        h3 {
            margin-bottom: 28%;
        }

        &.active {
            background-image: url(~@images/nav/footer_pre.png);
        }
    }


}
</style>

<template>
    <div class="nav-item-container" @click="navClickEvent(item)">
        <div :class="`item${item.isActive ? ' active' : ''}`">
            <h3>{{ item.name }}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FrontEndNavItem',
    props: {
        item: {
            type: Object,
            default: () => {
                return {
                    name: "-",
                    id: 1,
                    isActive: false,
                    path: ""
                }
            }
        }
    },
    data() {
        return {

        };
    },

    mounted() {

    },

    methods: {
        navClickEvent(e) {
            this.$emit('jumpNav', e)
        }
    },
};
</script>