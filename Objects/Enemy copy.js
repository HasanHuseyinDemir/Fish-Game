import { visuo } from "../visuo.js"
import { growRate, Player } from "./Player.js"

const EnemyMoveCombinations={
    xInc(obj,speed){
        obj.data.x+=speed
        obj.visual.flipX=true
    },
    xDec(obj,speed){
        obj.data.x-=speed
        obj.visual.flipX=false
    },
    yInc(obj,speed){
        obj.data.y+=speed
    },
    yDec(obj,speed){
        obj.data.y-=speed
    },
    stable(){},
    diagonalPositive(obj,speed){
        obj.data.x+=speed
        obj.visual.flipX=true
        obj.data.y+=speed
    },
    diagonalNegative(obj,speed){
        obj.data.x-=speed,
        obj.visual.flipX=false,
        obj.data.y-=speed
    },
    diagonalXy(obj,speed){
        obj.data.x+=speed
        obj.visual.flipX=true
        obj.data.y-=speed
    },
    diagonalxY(obj,speed){
        obj.data.x-=speed
        obj.visual.flipX=false
        obj.data.y+=speed
    }
}

let enemyFishSpriteNames=["e1","e2","e3","e4"]//Biliyorum çokta yaratıcı isimler değil :D

export function createEnemy(){
    let lifeCycleTime
    let luck=visuo.rand.bool()
    let moveTimer=visuo.createTimer(randomMoveTimer())//Karar
    let ghostTime=visuo.createTimer(2000)
    let started=false
    function startLife(){    
        lifeCycleTime=visuo.createTimer(visuo.rand.int(2000,10000))
    }
    function randomMoveTimer(){
        return visuo.rand.int(4000,10000)
    }
    function randSpeed(){
        return visuo.rand.float(0.3,0.5)
    }
    function pickRandomMovement() {
        const keys = Object.keys(EnemyMoveCombinations);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        return EnemyMoveCombinations[randomKey];
    }

    const Enemy={
        visual:{
            type:"image",
            image:"ghost",
            get width(){
                return Enemy.data.size
            },
            get height(){
                return Enemy.data.size/2
            },
            get x(){
                return Enemy.data.x
            },
            get y(){
                return Enemy.data.y
            },
            set x(a){
                if(a<0){
                    Enemy.visual.flipX=false
                }else{
                    Enemy.visual.flipX=true
                }
                Enemy.data.x=a 
            },
            set y(a){
                Enemy.data.x=a
            },
            flipX:true,
        },
        data:{
            x:visuo.rand.int(0,890),
            y:visuo.rand.int(0,590),
            size:null,
            speed:1,
            sprite:visuo.rand.pick(enemyFishSpriteNames),
            state:"GHOST",
            moveComb:null,
        },
        onStep({game}){
            
            if(ghostTime.isCompleted&&!started){
                Enemy.data.state="ENEMY"
                Enemy.visual.image=Enemy.data.sprite
                started=true
                startLife()
                visuo.sound("bub0").play()
            }

            if(moveTimer.isCompleted){
                Enemy.data.speed=randSpeed()
                Enemy.data.moveComb=pickRandomMovement()
                moveTimer.setDuration(randomMoveTimer())
                moveTimer.restart()
            }

            if(Enemy.data.moveComb){
                Enemy.data.moveComb(Enemy,Enemy.data.speed)
            }

            game.actions.searchObjectBy.tag("enemy").forEach((e)=>{
                if(visuo.calc.collisionDetectRect(e.visual,Enemy.visual)){
                    if((Enemy.data.size>e.data.size)&&e.data.state===Enemy.data.state){
                        Enemy.data.size+=growRate(e.data.size)/3
                        game.actions.destroyObject(e)
                    }
                }
            })
            

            let {canvas}=game.visual
            let data=Enemy.data
            if(data.x>canvas.width-(data.size)){
                data.x=canvas.width-(data.size)
                Enemy.data.moveComb=pickRandomMovement()
            }
            if(data.y>canvas.height-(data.size/2)){
                data.y=canvas.height-(data.size/2)
                Enemy.data.moveComb=pickRandomMovement()

            }
            if(data.x<0){
                Enemy.data.moveComb=pickRandomMovement()
                data.x=0
            }
            if(data.y<0){
                Enemy.data.moveComb=pickRandomMovement()
                data.y=0
            }
        },
        onDestroy(){
            visuo.sound("bub1").play()
        },
        tags:["enemy"]
    }
    if(luck){
    let able=Player.data.size>300?300:Player.data.size
    Enemy.data.size=visuo.rand.int(10,able)
    }else{
        let secondLuck=visuo.rand.int(0,100)

        if(secondLuck<10){
            Enemy.data.size=visuo.rand.int(170,200)
        }else if(secondLuck<20){
            Enemy.data.size=visuo.rand.int(150,200)
        }else{
            Enemy.data.size=visuo.rand.int(30,90)
        }
    }
    return Enemy

}
