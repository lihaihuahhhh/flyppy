(function () {
    //背景类
    var Background = window.Background = function () {
        //自己的背景
        this.image = game.R['bg_day']
        //把自己的背景画上去
        // game.ctx.drawImage(this.image, 100, 100)
        this.y = 0.75 * game.canvas.height - 396
        this.x = 0
        //这是背景图片的尺寸
        this.w = 288
        this.h = 512
        this.speed = 2
    }
    //背景渲染
    Background.prototype.render = function () {
        //渲染图片,这里注意下绘制位置.
        game.ctx.drawImage(this.image, this.x, this.y)
        game.ctx.drawImage(this.image, this.x + this.w, this.y)
        //渲染天空矩形
        game.ctx.fillStyle = "rgb(78, 192, 202)"
        game.ctx.fillRect(0, 0, game.canvas.width, this.y)
        game.ctx.fillRect(this.x, this.y, this.w + this.w, this.y)
        //渲染草坪
        game.ctx.fillStyle = "rgb(94, 226, 112)"
        // game.ctx.fillRect(this.x, this.y + this.h, this.w, game.canvas.height)
        // game.ctx.fillRect(this.x, this.y + this.h, this.w + this.w, game.canvas.height)
    }
    //背景运动
    Background.prototype.updata = function () {
        this.x -= this.speed
        if (this.x < -this.w + 125) {
            this.x = 0
        }
    }
})()