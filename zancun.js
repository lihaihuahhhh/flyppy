(function () {
    var Game = window.Game = function (params) {
        var self = this
        this.canvas = document.getElementById(params.id)
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
        //引入其他的类，在这个类里面不断的更新,这里有
        //一个游戏的经典套路，背景纯色，填矩形.
        this.background = new Background()
        this.land = new Land()
        this.bird = new Bird()
        this.canvas.addEventListener("click", function () {
            self.bird.fly()
        })
        //管子数组
        this.pipeArr = []
        //计数
        self.score = 0
        //设置定时器
        this.timer = setInterval(function () {
            // console.log(1)
            //清屏
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
            //调用背景渲染
            self.background.render()
            //背景更新
            self.background.updata()
            //这里开始是大陆
            self.land.render()
            self.land.updata()
            //实例化管子和调用渲染以及更新.
            // self.pipeArr.push(new Pipe())
            for (var i = 0; i < self.pipeArr.length; i++) {
                self.pipeArr[i] && self.pipeArr[i].updata()
                self.pipeArr[i] && self.pipeArr[i].render()
            }
            //调用bird类
            self.bird.updata()
            self.bird.render()
            //打印当前的分数,得到当前分数的位数。循环语句设置位数。
            for (var i = 0; i < self.score.toString().length; i++) {
                self.ctx.drawImage(self.R["shuzi" + self.score.toString().charAt(i)], self.canvas.width / 2 - (self.score.toString().length) / 2 * 34 + 34 * i, 100)
            }
            //每多少帧实例化管子
            self.fno % 100 == 0 && (new Pipe())
            //真编号
            self.fno = self.fno + 1
            //打印编号
            self.ctx.textAlign = "center"
            self.ctx.font = "20px 微软雅黑"
            self.ctx.fillText(self.fno, 30, 30)
        }, 20)
    }
})()





    (function () {
        var Bird = window.Bird = function () {
            //随机一个小鸟的颜色
            this.color = parseInt(Math.random() * 3)
            //决定用图片，每个小鸟有不同的颜色.
            this.imageArr = [
                game.R["bird" + this.color + "_0"],
                game.R["bird" + this.color + "_1"],
                game.R["bird" + this.color + "_2"]
            ]
            //翅膀状态
            this.winStep = 0
            //小鸟的位置，小鸟的真实位置
            this.x = game.canvas.width * 0.3 - 24
            this.y = 100
            //鸟帧,用来控制上升或者下落
            this.fno = 0
            //角度
            this.d = 0
            //是否拥有能量
            this.hasEnergy = false
        }
        Bird.prototype.render = function () {
            game.ctx.save()
            //将坐标系拉到小鸟的中心点。
            game.ctx.translate(this.x, this.y)
            game.ctx.rotate(this.d)
            game.ctx.drawImage(this.imageArr[this.winStep], -24, -24)
            game.ctx.restore()
        }
        Bird.prototype.updata = function () {
            // console.log(this.T, this.R, this.B, this.L)


            //更新翅膀的状态,每固定的次数扑打一次
            game.fno % 3 == 0 && this.winStep++
            if (this.winStep > 2) {
                this.winStep = 0
            }
            //掉落算法
            if (!this.hasEnergy) {
                this.y += this.fno * 0.1
            } else {
                this.y -= (20 - this.fno) * 0.2
                if (this.fno > 20) {
                    this.hasEnergy = false
                }
            }
            // this.y += this.fno * 1.4
            this.fno++
            this.d += 0.03
            //计算bird自己四个碰撞检测值
            this.T = this.y - 12
            this.R = this.x + 17
            this.B = this.y + 12
            this.L = this.x - 17
            //验证自己是否落地
            if (this.B > game.canvas.height * 0.75) {
                clearInterval(game.timer)
            }
        }
        Bird.prototype.fly = function () {
            this.hasEnergy = true
            this.d = -0.6
            this.fno = 0
        }
    })()