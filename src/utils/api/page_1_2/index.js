
import request from '@/utils/request'
//MOCK

export function getBaseBarAPI(params = {}) {
    return request({
        url: '/api/mock/baseBar',
        method: 'get',
        params
    })
}
