$(function () {
  if (!common.isWechat()) {
    alert('友情提示：此浏览器暂不支持某些功能，请从微信中打开！');
    return;
  }
  common.getOpenId();
});