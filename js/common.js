var common = {
  getUrl: function () {
    // return "http://172.16.1.138:82/nlyby/";
    return "https://dl.broadmesse.net/nlyby/";
  },
  getOpenId: function () {
    var openid = window.localStorage.getItem('openid');
    var avatarid = window.localStorage.getItem('avatarid');
    // console.log(openid,avatarid);
    var that = this;
    if (!openid) {
      openid = +new Date();
      window.localStorage.setItem('openid', openid);
    }
    if (!avatarid) {
      avatarid = that.random(0, 41);
      window.localStorage.setItem('avatarid', avatarid);
    }
  },
  random: function (max, min) {
    return Math.ceil(Math.random() * (max - min)) + min;
  },
  // 获取url参数
  getParams: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  isWechat: function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }
}