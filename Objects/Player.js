import { gameOver } from "../scenes/gameover.js"
import { visuo } from "../visuo.js"
import { createEgg } from "./Enemy.js"

export function growRate(a){
    if(a<20){
        return visuo.rand.float(0.5,1)
    }
    if(a<40){
        return visuo.rand.float(1,2)
    }
    if(a<70){
        return visuo.rand.float(2,3)
    }
    if(a<100){
        return visuo.rand.float(3,3.5)
    }
    if(a<140){
        return visuo.rand.float(3.5,4)
    }
    if(a<180){
        return visuo.rand.float(4,4.5)
    }
    if(a<230){
        return visuo.rand.float(5,5.5)
    }
    //Max
    return 6
}

//6 ile 11 arası saniyede bir ses efekti
const enSmallTimer=visuo.createInterval("1000")

export const score={
    count:0
}

export const Player={
    visual:{
        type:"image",
        image:"player",
        get width(){
            return Player.data.size
        },
        get height(){
            return Player.data.size/2
        },
        get x(){
            return Player.data.x
        },
        get y(){
            return Player.data.y
        },
        set x(a){
            Player.data.x=a 
        },
        set y(a){
            Player.data.x=a
        },
        flipX:true,
    },
    data:{
        x:100,
        y:100,
        size:20,
        speed:1
    },
    controls:{
        down:{
            Space({game}){
                console.log("Hello")
                game.visual.scene.objects.push(createEgg(0,Player.visual.image,{x:Player.data.x,y:Player.data.y},5))
            },
        },
        press:{
            KeyW(){
                Player.data.y-=Player.data.speed
                Player.data.size-=0.001
            },
            KeyS(){
                Player.data.y+=Player.data.speed
                Player.data.size-=0.001
            },
            KeyA(){
                Player.visual.flipX=false
                Player.data.x-=Player.data.speed
                Player.data.size-=0.001
            },
            KeyD(){
                Player.visual.flipX=true
                Player.data.x+=Player.data.speed
                Player.data.size-=0.001
            }
        }
    },
    onStep({game}){

        let enemies=game.actions.searchObjectBy.tag("enemy")

        enemies.forEach(e=>{
            if(visuo.calc.collisionDetectRect(e.visual,Player.visual)){
                if(e.data.state=="ENEMY"&&e.data.size>Player.data.size){
                    alert("gameOver")
                    game.actions.setScene(gameOver)
                }else if(e.data.state=="ENEMY"&&e.data.size<Player.data.size){
                    Player.data.size+=growRate(e.data.size)
                    score.count+=growRate(e.data.size)
                    game.actions.destroyObject(e)
                    visuo.sound("nom").play()
                }
            }
        })

        if(enSmallTimer.isCompleted&&Player.data.size>200){
            Player.data.size-=0.3
        }

        let {canvas}=game.visual
        let data=Player.data
        if(data.x>canvas.width-(data.size)){
            data.x=canvas.width-(data.size)
        }
        if(data.y>canvas.height-(data.size/2)){
            data.y=canvas.height-(data.size/2)
        }
        if(data.x<0){
            data.x=0
        }
        if(data.y<0){
            data.y=0
        }
    },
    tags:["player","fish"]

}