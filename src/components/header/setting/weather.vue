<!-- src/components/Layout.vue -->
<template>
    <div class="weather">
        <img src=" " alt="">
        <div>
            <div>
                <span>weather.</span>
            </div>
            <div>
                <span class="temperature">30-38℃</span>
            </div>
        </div>
    </div>
</template>

<script>

// import navItem from "@components/header/navItem.vue"

export default {
    name: 'weather',
    components: {

    },
    data() {
        return {

        }
    },

    mounted() {

    },

    methods: {


    }

};
</script>

<style lang="scss" scoped>
.weather {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
        width: var(--font-size-100);
        height: var(--font-size-100);
        // margin-right: 5%;
    }


    .temperature {
        font-size: var(--font-size-32);
        font-family: var(--font-family-primary-Bold);
        color: var(--color-primary);
        letter-spacing: 0.25em;
    }
    span {
        color: var(--color-desc);
    }
}
</style>