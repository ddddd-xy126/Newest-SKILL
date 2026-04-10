<!-- src/components/Layout.vue -->
<template>
    <div class="setting">
        <div class="left">
            <customWeather />
            <div class="line"></div>
            <customDate />
        </div>

        <div class="right">
            <selections />
        </div>

    </div>
</template>

<script>

import customWeather from "@components/header/setting/weather.vue"
import customDate from "@components/header/setting/date.vue"
import selections from "@components/header/setting/selections.vue"

export default {
    name: 'weather',
    components: {
        customWeather, customDate, selections
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
.setting {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 55%;

        .line {
            width: 0.35rem;
            height: var(--font-size-100);
            background-color: var(--box-content-line);
        }

    }

    .right {
        width: 34%;
    }
}
</style>