import axios from 'axios';

let ApiUtils = {};

let base = "http://content.platform.com";//调用数据的域地址

ApiUtils.checkUserName = params => {
    return axios.get(`${base}/api/check/username`, {params: params}).then(res => res.data);
};

ApiUtils.register = params => {
    return axios.post(`${base}/api/register`, params).then(res => res.data);
};

ApiUtils.login = params => {
    return axios.post(`${base}/api/login`, params).then(res => res.data);
};

ApiUtils.checkRememberToken = params => {
    return axios.post(`${base}/api/check/token`, params).then(res => res.data);
};

ApiUtils.changePassword = params => {
    return axios.post(`${base}/api/password/change`, params).then(res => res.data);
};

ApiUtils.getProfile = params => {
    return axios.get(`${base}/api/profile/get`, {params: params}).then(res => res.data);
};

ApiUtils.changeProfile = params => {
    return axios.post(`${base}/api/profile/change`, params).then(res => res.data);
};

ApiUtils.getMyGroups = params => {
    return axios.get(`${base}/api/mygroups/get`, {params: params}).then(res => res.data);
};

ApiUtils.createGroups = params => {
    return axios.post(`${base}/api/group/create`, params).then(res => res.data);
};

export default ApiUtils;
