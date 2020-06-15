const app = getApp()

Page({
  data: {
    textArray: '',
    showImg: false,
    showProgress: false,
    progressPercent: 0,
    imgPosition: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Sunset_2007-1.jpg/800px-Sunset_2007-1.jpg",
    chooseFile: '从文件选择...',
    submit: '提交',
    reset: '重置',
    chosen: ''
  },
  choose: function (e) {
    console.debug(e);
    tt.filePicker({
      maxNum: 1,
      isSystem: true,
      success: (res) => {
        const file = res.list[0];
        console.debug(file);
        let task = tt.uploadFile({
          url: 'http://47.103.204.9:8080/wordCloud-1.0-SNAPSHOT/fileWords', // 目标地址
          filePath: file.path, // 本地文件路径
          name: 'file', // HTTP请求的文件名
          success: (res) => {
            console.debug(res);
            this.setData({
              showImg: true,
              imgPosition: 'data:image/png;base64,' + res.data//图片地址
            })
          },
          complete: (res) => {
            this.setData({
              showProgress: false
            })
          }
        });
        this.setData({
          showProgress: true
        });
        task.onProgressUpdate((res) => {
          console.debug(res);
          this.setData({
            progressPercent: res.progress
          });
        });
      }
    });
  },
  formSubmit: function (e) {
    // console.debug(e.detail.value.input);
    tt.request({
      //向后端提交数据
      url: `http://47.103.204.9:8080/wordCloud-1.0-SNAPSHOT/materialData`, // 目标服务器url
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: `words=${encodeURIComponent(e.detail.value.input)}`,
      success: (res) => {
        console.debug(res);
        this.setData({
          showImg: true,
          imgPosition: 'data:image/png;base64,' + res.data//图片地址
        })
      }
    });
  },
  formReset: function (e) {
    this.setData({
      showImg: false
    });
  }
})
