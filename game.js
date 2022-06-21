(function () {
    var Game = window.Game = function (params) {
        var self = this
        this.canvas = document.getElementById(params.id)
        this.audio = document.createElement("audio")
        // this.audio.src = "M/ziran.mp3"
        // this.audio.setAttribute("src", "M/ziran.mp3")
        // this.audio.play()
        this.ctx = this.canvas.getContext("2d")
        //资源文件的地址
        this.RjsonUrl = params.RjsonUrl
        //帧编号
        this.fno = 0
        //设置宽度和高度
        this.init()
        //读取资源
        this.loadAllResource(function () {
            console.log("资源读取完毕")
            //实例化自己的场景管理器
            self.sm = new SceneManger()
            self.start()
        })
    }
    //初步设置宽高。
    Game.prototype.init = function () {
        var windowWidth = document.documentElement.clientWidth
        var windowHeiht = document.documentElement.clientHeight
        //有时候我们并不需要视图随着client的大小变化，最好限定。
        if (windowWidth > 414) {
            windowWidth = 414
        }
        if (windowHeiht > 736) {
            windowHeiht = 736
        }
        this.canvas.width = windowWidth
        this.canvas.height = windowHeiht
    }
    //读取资源
    Game.prototype.loadAllResource = function (callback) {
        //准备一个对象
        this.R = {}
        //计数器，这个是加载资源的，但是这个不需要全局知道。
        var alreadyDoneNumber = 0
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var Robj = JSON.parse(xhr.responseText)
                //遍历数组
                for (let value of Robj.images) {
                    //在this上的R对象里面存储一个新的相同键的新image对象。
                    self.R[value.name] = new Image()
                    //这里只要添加了image对象的src属性就会发送请求
                    self.R[value.name].src = value.url
                    //监听
                    self.R[value.name].onload = function () {
                        alreadyDoneNumber++
                        //清屏和提示文字
                        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
                        var text = "正在加载第" + alreadyDoneNumber + "/" + Robj.images.length + "请稍后"
                        self.ctx.textAlign = "center"
                        self.ctx.font = "20px 微软雅黑"
                        self.ctx.fillText(text, self.canvas.width / 2, self.canvas.height / 2);
                        //判断是否加载完毕
                        if (alreadyDoneNumber == Robj.images.length) {
                            // alert("AllDON")
                            //此处资源已经加载完毕，开始执行传递的回调
                            callback()
                        }
                    }
                }
            }
        }
        xhr.open("get", this.RjsonUrl, true)
        xhr.send(null)
    }
    //开始游戏
    Game.prototype.start = function () {
        var self = this
        //设置定时器
        this.timer = setInterval(function () {
            // console.log(1)
            //清屏
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
            // 场景管理器的更新和渲染
            // self.sm.updata()
            self.sm.render()
            self.sm.updata()
            self.sm.bindEvent()
            //真编号
            self.fno = self.fno + 1
            //打印编号
            self.ctx.textAlign = "center"
            self.ctx.font = "20px 微软雅黑"
            self.ctx.fillText(self.fno, 30, 30)
            self.ctx.fillText("场景号" + self.sm.sceneNumber, 30, 60)
        }, 20)
    }
})()