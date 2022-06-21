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
            game.sm.enter(4)
        }
    }
    Bird.prototype.fly = function () {
        this.hasEnergy = true
        this.d = -0.6
        this.fno = 0
    }
})()