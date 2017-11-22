import axios from 'axios';

let WboxApiUtils = {};

let base = "http://content.platform.com";//调用数据的域地址
axios.defaults.timeout = 2000;//2秒超时

//设置参与人员的时候 获取群组信息（我创建的群组/我参加的群组）
WboxApiUtils.getMyGroups = params => {
    return axios.get(`${base}/api/wbox/web/groups`, {params: params}).then(res => res.data);
};
//创建新的项目
WboxApiUtils.createProject = params => {
      return axios.post(`${base}/api/wbox/project/create`, params).then(res => res.data);
};
//获取参与的项目列表
WboxApiUtils.getMyProjects = params => {
    return axios.get(`${base}/api/wbox/project/all`, {params: params}).then(res => res.data);
};

//删除项目
WboxApiUtils.delProject = params => {
      return axios.post(`${base}/api/wbox/project/del`, params).then(res => res.data);
};



export default WboxApiUtils;
