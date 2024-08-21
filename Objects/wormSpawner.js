import { gameScene } from "../scenes/gameScene.js";
import { visuo } from "../visuo.js";
import { Player, score } from "./Player.js";

function createWorm(pos){
    
    let worm={
        visual:{
            type:"image",
            image:"worm",
            get x(){
                return worm.data.x
            },
            get y(){
                return worm.data.y
            },
            get angle(){
                return worm.data.angle 
            },
            width:visuo.rand.int(6,9),
            height:visuo.rand.int(15,24),
        },
        data:{
            x:pos.x,
            y:pos.y,
            angle:0,
        },
        onStep({game}){
            let data=worm.data
            data.angle+=visuo.rand.float(0.1,0.3)
            data.y+=0.4
            if(visuo.calc.collisionDetectRect(worm.visual,Player.visual)){
                visuo.sound("nom").play()
                Player.data.size+=1
                score.count+=2
                game.actions.destroyObject(worm)
            }

            if(data.y>game.visual.canvas.height){
                game.actions.destroyObject(worm)
            }

        },
        tags:["worm"]
    }
    return worm
}

export const wormSpawner={ 
        visual:{
            type:"invisible"
        },
        data:{
            timer:visuo.createTimer(5555)
        },
        onStep(){
            let {timer}=wormSpawner.data
            if(timer.isCompleted){
                gameScene.objects.push(createWorm({y:0,x:visuo.rand.int(10,890)}))
                timer.restart()
            }
        },
        tags:["spawner"]
}