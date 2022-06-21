(function () {
    var Land = window.Land = function () {
        this.image = game.R.land
        this.x = 0
        this.y = game.canvas.height * 0.75
        this.w = 336
        this.h = 112
        this.speed = 2
    }
    //更新
    Land.prototype.updata = function () {
        var self = this
        self.x -= self.speed
        if (self.x < -self.w + 125) {
            self.x = 0
        }
    }
    //渲染
    Land.prototype.render = function () {
        var self = this
        game.ctx.drawImage(self.image, this.x, this.y)
        game.ctx.drawImage(self.image, this.x + this.w, this.y)
        game.ctx.fillStyle = "rgb(222, 216, 149)"
        game.ctx.fillRect(0, this.y + this.h, game.canvas.width, game.canvas.height)

    }
})()