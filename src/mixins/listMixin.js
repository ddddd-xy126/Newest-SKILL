// myMixin.js
export const listMixin = {
  data() {
    return {};
  },

  mounted() {},

  created() {},
  methods: {
    // title只显示第一个字加两个星号
    formatTitle(title) {
      if (!title) return "";
      return title.substring(0, 1) + "**";
    },

    formatStatus(content) {
      const statusList = {
        0: "未创建",
        1: "已创建",
      };
      return statusList[content];
    },

    formatState(content) {
      const stateList = {
        0: "使用寿命不足",
        1: "正常",
      };
      return stateList[content];
    },

    // content显示前三个字符和最后两个字符，中间用三个星号
    formatContent(content) {
      if (!content) return "";
      if (content.length <= 5) return content; // 内容太短就直接显示

      const prefix = content.substring(0, 3);
      const suffix = content.substring(content.length - 2);
      return `${prefix}***${suffix}`;
    },

    format(key, content) {
      if (key === "title") {
        return this.formatTitle(content);
      } else if (key === "content") {
        return this.formatContent(content);
      } else if (key === "status") {
        return this.formatContent(content);
      } else if (key === "id") {
        return "";
      } else if (key === "carId") {
        return this.formatName(content);
      } else if (key === "date") {
        return content;
      } else if (key === "name") {
        return this.firstName(content);
      } else if (key === "phone") {
        return this.formatContent(content);
      } else if (key === "way") {
        return this.formatContent(content);
      } else if (key === "model") {
        return content;
      } else if (key === "img") {
        return "";
      } else if (key === "state") {
        return this.formatState(content);
      }
    },

    // 首字 + 其他为*
    firstName(name) {
      if (!name || typeof name !== "string") return ""; // 安全处理

      const firstChar = name.charAt(0); // 获取首字符
      const maskedPart = "*".repeat(Math.max(0, name.length - 1)); // 生成星号部分

      return firstChar + maskedPart;
    },

    // 首字 + ** + 尾字
    formatName(content) {
      if (!content) return "";
      if (content.length <= 2) return content; // 内容太短就直接显示

      const prefix = content.substring(0, 1);
      const suffix = content.substring(content.length - 1);
      return `${prefix}**${suffix}`;
    },

    // 动态绑定样式 已完成 待处理 处理中
    statusClass(status) {
      return this.statusMap[status]?.class || "";
    },

    // 返回状态对应的样式对象（背景色 + 左边框），:style="statusStyle(item.status)
    statusStyle(status) {
      const item = this.statusMap[status];
      return item
        ? {
            backgroundColor: item.color,
            borderLeft: item.border,
          }
        : {};
    },

    // 首字 + *+ 尾字
    maskName(name) {
      if (!name) return "";
      if (name.length <= 2) return name[0] + "*";
      return name[0] + "*" + name.slice(2);
    },
  },
  computed: {},
};
