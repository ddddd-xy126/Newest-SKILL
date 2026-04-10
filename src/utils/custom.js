

// 获取当前时间
export function getCurrentFormattedDateRobust() {
    const now = new Date();
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        weekday: 'long'
    };

    const parts = new Intl.DateTimeFormat('zh-CN', options).formatToParts(now);

    const dateMap = {};
    parts.forEach(({ type, value }) => {
        dateMap[type] = value;
    });

    const formattedDate = [`${dateMap.year}.${dateMap.month}.${dateMap.day}`, `${dateMap.hour}:${dateMap.minute}:${dateMap.second}`, `${dateMap.weekday}`]

    return formattedDate;
}



