var common = {
  getUrl: function () {
    // return "http://172.16.1.138:82/nlyby/";
    return "https://dl.broadmesse.net/nlyby/";
  },
  getOpenId: function () {
    var openid = window.localStorage.getItem('openid');
    if (!openid) {
      openid = +new Date();
      window.localStorage.setItem('openid', openid);
    }
  },
  // 获取url参数
  getParams: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }
}