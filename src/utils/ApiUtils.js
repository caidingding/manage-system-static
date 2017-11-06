import axios from 'axios';

let ApiUtils = {};

let base = "http://content.platform.com";//调用数据的域地址
axios.defaults.timeout = 2000;//2秒超时

ApiUtils.checkUserName = params => {
    return axios.get(`${base}/api/check/username`, {params: params}).then(res => res.data);
};

ApiUtils.register = params => {
    return axios.post(`${base}/api/register`, params).then(res => res.data);
};

ApiUtils.login = params => {
    return axios.post(`${base}/api/login`, params).then(res => res.data);
};

//检查用户token
ApiUtils.checkRememberToken = params => {
    return axios.post(`${base}/api/check/token`, params).then(res => res.data);
};

//更改密码
ApiUtils.changePassword = params => {
    return axios.post(`${base}/api/password/change`, params).then(res => res.data);
};

//获取个人信息
ApiUtils.getProfile = params => {
    return axios.get(`${base}/api/profile/get`, {params: params}).then(res => res.data);
};

//更改个人信息
ApiUtils.changeProfile = params => {
    return axios.post(`${base}/api/profile/change`, params).then(res => res.data);
};

//获取自己的群组，包含自己创建的和拉进自己的
ApiUtils.getMyGroups = params => {
    return axios.get(`${base}/api/groups/my`, {params: params}).then(res => res.data);
};

//创建群组
ApiUtils.createGroups = params => {
    return axios.post(`${base}/api/group/create`, params).then(res => res.data);
};

//获取自己拥有的群组信息
ApiUtils.getOwnedGroupInfo = params => {
    return axios.get(`${base}/api/group/owned/get`, {params: params}).then(res => res.data);
};

//编辑群组信息
ApiUtils.editGroups = params => {
    return axios.post(`${base}/api/group/edit`, params).then(res => res.data);
};

//获取请求入组的成员列表
ApiUtils.getApplyInGroupMembers = params => {
    return axios.get(`${base}/api/group/apply/members`, {params: params}).then(res => res.data);
};

//更改用户组申请者状态
ApiUtils.changeGroupMembersApply = params => {
    return axios.post(`${base}/api/group/members/apply/change`, params).then(res => res.data);
};

//根据字符返回用户名提示
ApiUtils.queryUserName = params => {
    return axios.get(`${base}/api/user/name/query`, {params: params}).then(res => res.data);
};
//将用户添加到组
ApiUtils.AddMemberToGroup = params => {
    return axios.post(`${base}/api/group/members/add`, params).then(res => res.data);
};
//获取组里的用户列表
ApiUtils.getGroupMembers = params => {
    return axios.get(`${base}/api/group/members`, {params: params}).then(res => res.data);
};
//从组里移除用户
ApiUtils.delMemberFromGroup = params => {
    return axios.post(`${base}/api/group/members/del`, params).then(res => res.data);
};
//修改groupMember的类型
ApiUtils.changeGroupMemberType = params => {
    return axios.post(`${base}/api/group/members/type/change`, params).then(res => res.data);
};

//获取所有创建的群组，包含自己创建的和拉进自己的
ApiUtils.getAllGroups = params => {
    return axios.get(`${base}/api/groups/all`, {params: params}).then(res => res.data);
};

//用户申请加入群组
ApiUtils.changeGroupApply = params => {
    return axios.post(`${base}/api/group/apply/change`, params).then(res => res.data);
};

//获取我的内容
ApiUtils.getMyTreeRootsByGroupIds = params => {
    return axios.get(`${base}/api/tree/root/get/group`, {params: params}).then(res => res.data);
};
//创建content root
ApiUtils.createContentTreeRoot = params => {
    return axios.post(`${base}/api/tree/root/create`, params).then(res => res.data);
};

//修改content root
ApiUtils.editContentTreeRoot = params => {
    return axios.post(`${base}/api/tree/root/update`, params).then(res => res.data);
};

//根据用户名和组获取有权限的树根节点
ApiUtils.getAuthorizedTreeRoots = params => {
    return axios.get(`${base}/api/tree/root/authorized/get`, {params: params}).then(res => res.data);
};

//urls
ApiUtils.avatarUploadUrl = `${base}/api/user/avatar/upload`;

export default ApiUtils;
