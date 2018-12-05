import {
  Toast
} from 'vant'

var bts = [{
  title: "分享图片"
}, {
  title: "分享给微信好友"
}, {
  title: "分享到微信朋友圈"
}];
export function shareWeixinMessage(pid, name, js, id) {
  js = js.replace(/<\/?.+?>/g, "")
  var that = this
  plus.nativeUI.actionSheet({
    cancel: "取消",
    buttons: bts
  }, function (e) {
    var i = e.index;
    if (i == 1) {
      window.location.hash = `/kctd/${pid}?uid=${id}&pid=${pid}`
    } else if (i == 2) {
      sharewx.send({
        type: 'web',
        title: `${name}的分享`,
        content: `${js}`,
        href: `http://web.51fth.com/fth-fino//static/fth-admin/html/wx/html/project/project_list_xq.html?uid=${id}&pid=${pid}`,
        extra: {
          scene: "WXSceneSession"
        }
      }, function () {
        Toast.success("分享成功！");
      }, function (e) {
        Toast("分享失败"+JSON.stringify(e));
      });
    } else if (i == 3) {
      sharewx.send({
        type: 'web',
        title: `${name}的分享`,
        content: `${js}`,
        href: `http://web.51fth.com/fth-fino//static/fth-admin/html/wx/html/project/project_list_xq.html?uid=${id}&pid=${pid}`,
        extra: {
          scene: "WXSceneTimeline"
        }
      }, function () {
        Toast.success("分享成功！");
      }, function (e) {
        Toast("分享失败"+JSON.stringify(e));
      });
    }
  })
}