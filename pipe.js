(function () {
    var Pipe = window.Pipe = function () {
        this.image1 = game.R.pipe_down
        this.image0 = game.R.pipe_up
        this.h = 320
        this.w = 52
        //自己的位置
        this.x = game.canvas.width
        //总高，包括了上馆子和下馆子和空隙的高度.
        this.allHeight = game.canvas.height * 0.75
        //空隙
        this.interspace = 120
        //随机一个上馆子的高度
        this.height1 = parseInt(Math.random() * this.h)
        //判断是否已经加过分了
        this.alreadyPass = true
        //下馆子定死了
        this.height2 = this.allHeight - this.height1 - this.interspace
        game.pipeArr.push(this)
    }

    //更新
    Pipe.prototype.updata = function () {
        this.x -= 2
        //碰撞检测，检测自己有没有撞到小鸟
        if (game.sm.bird.R > this.x && game.sm.bird.L < this.x + 52) {
            if (game.sm.bird.T < this.height1 || game.sm.bird.B > this.height1 + this.interspace) {
                //碰撞了，
                //进入第四个页面
                game.sm.enter(4)
                // clearInterval(game.timer)
            }
        }
        //如果已经通过了管子就给加分，但是需要注意，通过的管子不要再加分，
        if (game.sm.bird.R > this.x + 52 && this.alreadyPass) {
            game.sm.score++
            this.alreadyPass = false
        }
        //判断管子是否还在视图中，不再的话删除
        if (this.x < -52) {
            for (var i = 0; i < game.pipeArr.length; i++) {
                if (game.pipeArr[i] === this) {
                    game.pipeArr.splice(i, 1)
                }
            }
        }
    }

    //渲染
    Pipe.prototype.render = function () {
        var self = this
        game.ctx.drawImage(self.image1, 0, this.h - this.height1, this.w, this.height1, this.x, 0, 52, this.height1)
        game.ctx.drawImage(self.image0, 0, 0, this.w, this.height2, this.x, this.height1 + this.interspace, 52, this.height2)
    }
})()