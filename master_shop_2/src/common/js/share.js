import {
  Toast
} from 'vant'

var bts = [{
  title: "分享给微信好友"
}, {
  title: "分享到微信朋友圈"
}];
export function shareWeixinMessage(spid,name,tit) {
  plus.nativeUI.actionSheet({
    cancel: "取消",
    buttons: bts
  }, function (e) {
    var i = e.index;
    if (i == 1) {
      sharewx.send({
        type:'web',
        title:`${name}管家小店`,
        content: `${tit}`,
        href: `&spid=${spid}`,
        extra: {
          scene: "WXSceneSession"
        }
      }, function () {
        Toast.success("分享成功！");
      }, function (e) {
        Toast("分享失败");
      });
    } else if(i == 2) {
      sharewx.send({
        type: 'web',
        title: `${name}管家小店`,
        content: `${tit}`,
        href: `&spid=${spid}`,
        extra: {
          scene: "WXSceneTimeline"
        }
      }, function () {
        Toast.success("分享成功！");
      }, function (e) {
        Toast("分享失败");
      });
    }
  })
}