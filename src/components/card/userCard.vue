<style lang="scss" scoped>
.user-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: white;

    .card-top {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .user-type {
            text-shadow: 0px 0px 8.57px rgba(92, 148, 255, 0.5);
            font-size: var(--font-size-28);
            font-family: var(--font-family-primary-Medium);
        }

        .score {
            align-self: center;
            font-family: var(--font-family-primary-Medium);
            font-size: var(--font-size-34);
        }

        .score-unit {
            font-size: var(--font-size-24);
            font-family: var(--font-family-primary-Regular);
            color: rgba(195, 206, 226, 1);
            margin-left: 2px;
            text-shadow: 0px 0px 0px rgba(92, 148, 255, 0);
        }
    }

    .card-bottom {
        color: white;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        .user {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 0;

            .icon {
                width: var(--font-size-8);
                height: var(--font-size-8);
                background-color: #B1E1FF;
                box-shadow: 0px 0px 8px 0px rgba(51, 175, 255, 0.8);
            }

            .label {
                font-size: var(--font-size-28);
                color: rgba(195, 206, 226, 1);
                font-family: var(--font-family-primary-Regular);
            }

            .value {
                font-size: var(--font-size-28);
                font-family: var(--font-family-primary-Bold);

                span {
                    font-size: var(--font-size-28);
                    color: rgba(195, 206, 226, 1);
                    font-family: var(--font-family-primary-Regular);
                }
            }
        }

        .stat {
            background: url(~@images/card/user_card_border.png) no-repeat center center;
            background-size: 100% 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 1.5rem;

            .label {
                font-size: var(--font-size-28);
                color: rgba(255, 255, 255, 0.8);
                font-family: var(--font-family-primary-Regular);
            }

            .value {
                font-size: var(--font-size-28);
                font-family: var(--font-family-primary-Bold);
            }
        }
    }
}
</style>
<template>
    <div class="user-card">
        <!-- 上部分：图片和分数 -->
        <div class="card-top"
            :style="{ backgroundImage: userType === 'VIP用户' ? `url(${require('@/assets/images/card/vip_user.png')})` : `url(${require('@/assets/images/card/normal_user.png')})` }">
            <div class="user-type">{{ userType }}</div>
            <div class="score"
                :style="{ textShadow: userType === 'VIP用户' ? '0px 0px 8.57px rgba(255, 191, 19, 0.5),0px 0px 8.57px rgba(255, 191, 19, 0.703)' : '0px 0px 8.57px rgba(92, 148, 255, 0.5),0px 0px 8.57px rgba(92, 148, 255, 0.703)' }">
                {{ score }}<span class="score-unit">分</span></div>
        </div>

        <!-- 下部分：用户统计信息 -->
        <div class="card-bottom">

            <div class="user">
                <span class="icon"></span>
                <span class="label">用户数</span>
                <span class="value">{{ userCount }} <span class="unit">人</span></span>
            </div>

            <!-- 当有异常用户时才显示正常和异常用户数 -->

            <div v-if="abnormalCount > 0" class="stat">
                <span class="label font-color-gradient-blue">正常</span>
                <span class="value">{{ normalCount }}</span>
            </div>
            <div v-if="abnormalCount > 0" class="stat">
                <span class="label font-color-gradient-red">异常</span>
                <span class="value">{{ abnormalCount }}</span>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'UserCard',
    props: {
        userType: {
            type: String,
            default: 'VIP用户'
        },
        score: {
            type: [Number, String],
            default: 78
        },
        userCount: {
            type: [Number, String],
            default: 25
        },
        normalCount: {
            type: [Number, String],
            default: 0
        },
        abnormalCount: {
            type: [Number, String],
            default: 0
        }
    }
}
</script>
