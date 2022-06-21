(function () {
    var SceneManger = window.SceneManger = function () {
        //1表示欢迎屏幕，2表示游戏内容，3表示游戏结束
        let self = this
        this.sceneNumber = 1
        //场景管理器实例化
        this.bg = new Background()
        this.land = new Land()
        this.bird = new Bird()
        this.titleY = -48
        this.buttonY = game.canvas.height
        this.buttonX = game.canvas.width / 2 - 58
        this.pannal = 200
    }
    SceneManger.prototype.updata = function () {
        let self = this
        switch (this.sceneNumber) {
            case 1:
                self.titleY += 2
                if (self.titleY >= 200) {
                    self.titleY = 200
                }
                self.buttonY -= 2
                if (self.buttonY <= 400) {
                    self.buttonY = game.canvas.height - 150
                }
                break
        }
    }
    SceneManger.prototype.render = function () {
        //更具当前是第几个场景来决定来做什么
        var self = this
        switch (this.sceneNumber) {
            case 1:
                self.bg.render()
                self.land.render()
                self.bird.render()
                self.bird.x = game.canvas.width / 2
                game.ctx.drawImage(game.R["title"], game.canvas.width / 2 - 89, self.titleY)
                game.ctx.drawImage(game.R["button_play"], self.buttonX, self.buttonY)
                break
            case 2:
                self.bg.render()
                self.land.render()
                self.bird.render()
                self.bird.updata()
                //画教程小图
                game.ctx.drawImage(game.R["tutorial"], game.canvas.width / 2 - 58, 300)
                break
            case 3:
                self.bg.render()
                self.land.render()
                self.bird.render()
                self.bird.updata()
                //实例化管子和调用渲染以及更新.
                // self.pipeArr.push(new Pipe())
                for (var i = 0; i < game.pipeArr.length; i++) {
                    game.pipeArr[i] && game.pipeArr[i].updata()
                    game.pipeArr[i] && game.pipeArr[i].render()
                }
                //打印当前的分数,得到当前分数的位数。循环语句设置位数。
                for (var i = 0; i < self.score.toString().length; i++) {
                    game.ctx.drawImage(game.R["shuzi" + self.score.toString().charAt(i)], game.canvas.width / 2 - (self.score.toString().length) / 2 * 34 + 34 * i, 100)
                }
                //每多少帧实例化管子
                self.fno % 100 == 0 && (new Pipe())
                //真编号
                self.fno = self.fno + 1
                break
            case 4:
                self.bg.render()
                self.land.render()
                self.bird.render()
                self.bird.y += 2
                if (self.bird.y >= game.canvas.height * 0.75) {
                    self.bird.y = game.canvas.height * 0.75
                }
                game.ctx.drawImage(game.R["score_panel"], game.canvas.width / 2 - 119, self.pannal)
                game.ctx.font = '30px serif'
                game.ctx.fillStyle = "black"
                game.ctx.fillText(self.score, game.canvas.width / 2 - 76, self.pannal + 73)

        }
    }
    //进入某个场景
    SceneManger.prototype.enter = function (number) {
        let self = this
        this.sceneNumber = number
        switch (self.sceneNumber) {
            case 1:
                //进入1号场景这一瞬间要做的事情
                self.titleY = -48
                break;
            case 2:
                //进入二号场景
                break
            case 3:
                //进入三场景，也就是游戏界面
                //管子数组
                game.pipeArr = []
                //计数
                self.score = 0
                self.fno = 0
                self.bird.y = 100
                game.audio.setAttribute("src", "M/ziran.mp3")
                game.audio.play()
                break
            //三渲染的四都要渲染
            case 4:
                game.audio.setAttribute("src", "M/baozha.mp3")
                game.audio.play()
        }
    }
    //添加监听
    SceneManger.prototype.bindEvent = function (number) {
        let self = this
        game.canvas.onclick = function (event) {
            var mousex = event.clientX
            var mousey = event.clientY
            switch (self.sceneNumber) {
                case 1:
                    if (self.buttonX < mousex && mousex < self.buttonX + 116 && mousey < self.buttonY + 70 && mousey > self.buttonY) {
                        //用户点击了按钮
                        game.audio.setAttribute("src", "M/ziran.mp3")
                        game.audio.play()
                        self.enter(2)
                    }
                    break
                case 2:
                    if (true) {
                        self.enter(3)
                        game.canvas.addEventListener("click", function () {
                            self.bird.fly()
                        })
                    }
                    break
                case 3:
                    // self.enter(2)
                    // self.enter(4)
                    break
                case 4:
                    if (mousex > game.canvas.width / 2 - 100 && mousex < game.canvas.width / 2 + 100 && mousey < self.pannal + 73 && mousey > self.pannal)
                        self.enter(3)
                    break
            }
        }
    }
})()