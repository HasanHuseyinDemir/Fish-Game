import { game } from "../game.js";
import { gameScene } from "../scenes/gameScene.js";
import { visuo } from "../visuo.js";
import { createEnemy } from "./Enemy.js";

const destro=visuo.createInterval(30000)

export const RandTime=visuo.createTimer(visuo.rand.int(1000,2000),()=>{
    let enemies=game.actions.searchObjectBy.tag("enemy")
    let ghost=game.actions.searchObjectBy.tag("ghost")[0]
    if(ghost){
        game.actions.destroyObject(ghost)
        visuo.sound("bub2").play()
    }

    if(game.visual.scene==gameScene){
        if(enemies.length>15&&destro.isCompleted){
            let eldest
            enemies.forEach(e => {
                if(eldest){
                    eldest.data.started<e.data.started
                }else{
                    eldest=e
                }
            });
            //game.actions.destroyObject(eldest)
            eldest.data.state="GHOST"
            eldest.tags=["ghost"]
            eldest.data.speed=0
            eldest.visual.image="ghost"
            visuo.sound("bub7").play()
        }
        if(enemies.length<50){
            gameScene.objects.push(createEnemy())
        }else{
            let eldest
            enemies.forEach(e => {
                if(eldest){
                    eldest.data.started<e.data.started
                }else{
                    eldest=e
                }
            });
            //game.actions.destroyObject(eldest)
            eldest.data.state="GHOST"
            eldest.tags=["ghost"]
            eldest.data.speed=0
            eldest.visual.image="ghost"
            visuo.sound("bub7").play()
        }
    }
    RandTime.setDuration(visuo.rand.int(400,1500))
    RandTime.restart()
})