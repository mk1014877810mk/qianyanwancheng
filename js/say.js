$(function () {
  var ajaxUrl = common.getUrl();
  var time = 30;
  var timer = null;
  var localId = '';
  var serverId = '';
  var canClick = true;
  var canSend = true;
  var say = {
    init: function () {
      var that = this;
      if (!common.isWechat()) {
        alert('友情提示：此浏览器暂不支持某些功能，请从微信中打开！');
        return;
      }
      $.ajax({
        url: ajaxUrl + 'getJsSdkInfo.php',
        type: 'get',
        data: {
          wx_url: location.href.split('#')[0]
        },
        success: function (res) {
          var json = JSON.parse(res);
          if (json.code == 200) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: json.data.appId, // 必填，公众号的唯一标识
              timestamp: json.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: json.data.nonceStr, // 必填，生成签名的随机串
              signature: json.data.signature, // 必填，签名，见附录1
              jsApiList: [
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice"
              ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.error(function (err) {
              alert('认证失败了', JSON.stringify(err));
            });

            wx.ready(function () {
              // alert('ready');
              that.clickEvent();
            });
          }
        }
      });
    },
    clickEvent: function () {
      var that = this;
      $('#luyin,#chonglu').off('click').on('click', that.start);
      $('#tingzhi').off('click').on('click', that.pause);
      $('#chonglu').off('click').on('click', function () {
        $('#zanting').click();
        $('.bottom-bottom').addClass('hide').siblings().removeClass('hide');
        that.start(event);
      });
      // 试听
      $('#shiting').off('click').on('click', function () {
        wx.playVoice({
          localId: localId
        });
        var playTime = 30 - time;
        $('.time').removeClass('hide').html(playTime);
        clearInterval(timer);
        $('#top_img').attr('src', '../images/shiting.gif');
        timer = setInterval(function () {
          playTime--;
          if (playTime < 0) {
            clearInterval(timer);
            $('.time').addClass('hide');
            $('#top_img').attr('src', '../images/luyin.png');
            $('#zanting').addClass('hide').siblings('#shiting').removeClass('hide');
          } else {
            $('.time').html(playTime);
          }
        }, 1000);
        $(this).addClass('hide').siblings('#zanting').removeClass('hide');
        // 监听语音播放完毕接口
        wx.onVoicePlayEnd({
          success: function (res) {
            clearInterval(timer);
            $('.time').addClass('hide');
            $('#top_img').attr('src', '../images/luyin.png');
            $('#zanting').addClass('hide').siblings('#shiting').removeClass('hide');
          }
        });
      });
      // 停止
      $('#zanting').off('click').on('click', function () {
        wx.stopVoice({
          localId: localId
        });
        clearInterval(timer);
        $('.time').addClass('hide');
        $('#top_img').attr('src', '../images/luyin.png');
        $('#zanting').addClass('hide').siblings('#shiting').removeClass('hide');
      });
      // 发送
      $('#fasong').off('click').on('click', function () {
        if (time >= 29) {
          alert('发送的录音时长需大于1秒');
          return;
        }
        if (!canSend) return;
        canSend = false;
        wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            serverId = res.serverId; // 返回音频的服务器端ID
            $('#zanting').click();
            that.send(serverId);
          }
        });
      });
    },
    start: function (event) {
      event.preventDefault();
      var that = this;
      if (!canClick) return;
      canClick = false;
      wx.startRecord({
        success: function () {
          time = 30;
          $('.time').removeClass('hide').html(time);
          $('#luyin').addClass('hide').siblings().removeClass('hide');
          $('#top_img').attr('src', '../images/luyin.gif');
          timer = setInterval(function () {
            time--;
            if (time <= 0) {
              clearInterval(timer);
              wx.stopRecord({
                success: function (res) {
                  localId = res.localId;
                  $('.time').addClass('hide');
                  $('#top_img').attr('src', '../images/luyin.png');
                  $('.bottom-bottom').removeClass('hide').siblings().addClass('hide');
                  canClick = true;
                },
                fail: function (err) {
                  console.log('停止失败', err);
                  $('.time').addClass('hide');
                  $('#top_img').attr('src', '../images/luyin.png');
                  $('.bottom-bottom').removeClass('hide').siblings().addClass('hide');
                  canClick = true;
                }
              });
            } else {
              $('.time').html(time);
            }
          }, 1000);
        }
      });
    },
    pause: function (event) {
      event.preventDefault();
      if (canClick) return;
      wx.stopRecord({
        success: function (res) {
          localId = res.localId;
          // $('.tips').html('停止成功', res);
          $('.time').addClass('hide');
          $('#top_img').attr('src', '../images/luyin.png');
          $('.bottom-bottom').removeClass('hide').siblings().addClass('hide');
          clearInterval(timer);
          canClick = true;
        },
        fail: function (err) {
          console.log('停止失败', err);
          $('.time').addClass('hide');
          $('#top_img').attr('src', '../images/luyin.png');
          $('.bottom-bottom').removeClass('hide').siblings().addClass('hide');
          clearInterval(timer);
          canClick = true;
        }
      });
    },
    send: function (serverId) {
      var that = this;
      $.ajax({
        url: ajaxUrl + 'getAudio.php',
        type: 'get',
        data: {
          media_id: serverId,
          openid: window.localStorage.getItem('openid'),
          duration: 30 - time,
          avatarid: window.localStorage.getItem('avatarid'),
        },
        success: function (res) {
          canSend = true;
          if (res.code == 200) {
            alert('上传成功！');
            window.history.go(-1);
          }
        },
        error: function (err) {
          canSend = true;
          alert('上传失败！');
        }
      })
    },
    dowmload: function (serverId) {
      alert('我进来了', serverId);
      wx.downloadVoice({
        serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          var localId = res.localId; // 返回音频的本地ID
        }
      });
    }
  }

  common.getOpenId();
  say.init();
});