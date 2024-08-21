import { menuScene } from "./scenes/menu.js";
import { visuo } from "./visuo.js";
import { RandTime } from "./Objects/RandEnemySpawner.js";

export const game=visuo.createGame({
    scene:menuScene,
    begin(){
        RandTime.isCompleted
    },
    controls:{
        down:{
            KeyF(){
                game.actions.goFullscreen()
            }
        }
    }
})

game.actions.resize(900,600)


game.actions.makeSharp()