$(function () {
  var ajaxUrl = common.getUrl();
  var playSrc = "../images/yuyin.gif";
  var imgSrc = "../images/yuyin.png";
  var play = false;
  var timer = null;
  var lastIndex = -1;
  var hear = {
    init: function () {
      var that = this;
      if (!common.isWechat()) {
        alert('友情提示：此浏览器暂不支持某些功能，请从微信中打开！');
        return;
      }
      $.ajax({
        url: ajaxUrl + 'getAudioList.php',
        type: 'get',
        data: {
          openid: window.localStorage.getItem('openid'),
          lightid: 1
        },
        success: function (res) {
          // console.log('页面数据', res);
          if (res.code == 200) {
            var arr = [];
            res.data.forEach((el, i) => {
              var obj = {};
              obj.avatar = '../images/head' + el.avatarid + '.png';
              obj.aSrc = ajaxUrl + el.path;
              obj.duration = el.duration;
              obj.iSrc = imgSrc;
              arr.push(obj);
            });
            // console.log(arr);
            var html = template('tpl', arr);
            $('.box').html(html);
            that.clickEvent();
          }
        },
        error: function (err) {
          console.log('页面数据获取失败', err);
        }
      });
    },
    clickEvent: function () {
      $('.box').on('click', '.right', function () {
        var index = $(this).data('index');
        for (var i = 0; i < $('audio').length; i++) {
          $('audio')[i].pause();
        };
        if (!play) {
          play = true;
          $('audio')[index].play();
          $(this).children('img').attr('src', playSrc);
        } else {  // 正在播放
          if (lastIndex == index) {
            play = false;
            $(this).children('img').attr('src', imgSrc);
          } else {
            $('audio')[index].play();
            $(this).children('img').attr('src', playSrc);
            $(this).parent().siblings().children('.right').children('img').attr('src', imgSrc);
          }
        }
        $('audio').off('ended').on('ended', function () {
          $('.right img').attr('src', imgSrc);
          play = false;
        });
        lastIndex = index;
      });
    }
  }

  common.getOpenId();
  hear.init();
});