<style lang="scss" scoped>
.circle-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;


    .circle-container {
        // background-color: aquamarine;
        width: 90%;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .content {
            width: 90%;
            aspect-ratio: 1;
            border-radius: 50%;
            background: url(~@images/card/circleBg.png) no-repeat center center / cover;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;
           
        }

        .icon {
            position: absolute;
            top: 15%;
            width: 36%;
            aspect-ratio: 1;
        }

        .value-container {
            position: absolute;
            top: 55%;
            display: flex;
            align-items: baseline;
            color: var(--color-primary);

            .value {
                font-size: var(--font-size-28);
            }

            .unit {
                font-size: var(--font-size-22);
                color: var(--color-secondary);
                margin-left: 0.2rem;
            }
        }
    }

    .info-container {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-28);

        .title {
            color: var(--color-secondary);
        }

        .status {
            color: var(--color-primary);
        }
    }
}
</style>

<template>
    <div class="circle-card">
        <div class="circle-container">
            <div class="content">
                <img class="icon" :src="icon" :alt="title" v-if="icon">
                <div class="value-container">
                    <span class="value">{{ value }}</span>
                    <span class="unit">{{ unit }}</span>
                </div>
            </div>
        </div>
        <div class="info-container">
            <div class="title">{{ title }}</div>
            <span v-if="status">&nbsp;&nbsp;</span>
            <div class="status" v-if="status">{{ status }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CircleCard',
    props: {
        icon: {
            type: String,
            default: require("@/assets/images/card/icon_humidity.png")
        },
        value: {
            type: [String, Number],
            default: '0.01'
        },
        unit: {
            type: String,
            default: 'μg/m³'
        },
        title: {
            type: String,
            default: '标题'
        },
        status: {
            type: String,
            default: ''
        }
    }
}
</script>