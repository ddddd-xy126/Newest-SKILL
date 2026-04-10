
import request from '@/utils/request'
import axios from 'axios'

//token为本地测试服务器，实际开发按需获取
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczODkxNzAxNSwiZXhwIjoxNzQxNTA5MDE1fQ.KT9HmerUjOVCAbmYt1F24mWazaNCk7cIe5-eTNu9I7g"

export function createArticlesAPI(data) {
    return request({
        url: '/admin/articles',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'token': token
        }
    })
}


export function getArticlesListAPI(params) {
    return request({
        url: '/admin/articles',
        method: 'get',
        headers: {
            'token': token
        },
        params
    })
}




//MOCK

export function _getArticlesListAPI(params) {
    return axios({
        url: 'https://m1.apifoxmock.com/m1/5824754-5510165-default/api/mock/users',
        method: 'get',
        headers: {
            'token': token
        },
        params
    })
}





export function _getSecurityListAPI(params) {
    return axios({
        url: 'https://m1.apifoxmock.com/m1/5824754-5510165-default/api/mock/securityAlarm',
        method: 'get',
        headers: {
            'token': token
        },
        params
    })
}

// mock资产管理数据
export function _getAssetsListAPI() {
    return axios({
        url: 'https://m1.apifoxmock.com/m1/6933410-6649630-default/assets',
        method: 'get',
    })
}