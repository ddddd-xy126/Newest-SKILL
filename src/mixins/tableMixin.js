// myMixin.js
export const tableMixin = {
    data() {
        return {

        };
    },

    mounted() {

    },

    created() {

    },
    methods: {
        // title只显示第一个字加两个星号
        formatTitle(title) {
            if (!title) return '';
            return title.substring(0, 1) + '**';
        },

        formatStatus(content) {
            const statusList = {
                0: '未创建',
                1: '已创建'
            }
            return statusList[content];
        },
        formatStat(content) {
            const statusList = {
                0: '正常',
                1: '异常'
            }
            return statusList[content];
        },
        // content显示前三个字符和最后两个字符，中间用三个星号
        formatContent(content) {
            if (!content) return '';
            if (content.length <= 5) return content; // 内容太短就直接显示

            const prefix = content.substring(0, 3);
            const suffix = content.substring(content.length - 2);
            return `${prefix}***${suffix}`;
        },

        format(key, content) {
            if (key === 'title') {
                return this.formatTitle(content);
            } else if (key === 'content') {
                return this.formatContent(content);
            } else if (key === 'status') {
                return this.formatContent(content);
            }
            return content;
        }


    },
    computed: {

    }
};