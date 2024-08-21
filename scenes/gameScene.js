import { background } from "../Objects/background.js";
import { Player, score } from "../Objects/Player.js";
import { wormSpawner } from "../Objects/wormSpawner.js";
import { visuo } from "../visuo.js";

export const gameScene={
    onSceneInit(){
        visuo.sound("bgMusic").loop=true
        visuo.sound("bgMusic").play()
    },
    objects:[
    background,
    Player,
    {
        visual:{
            type:"text",
            text({game}){
                let fishes = game.actions.searchObjectBy.tag("fish")
                let best
                fishes.forEach((e)=>{
                    if(!best){best=e.data.size}
                    else if(e.data.size>best){
                        best=e.data.size
                    }
                })

                return `SCORE:${Math.floor(score.count)} SIZE:${Math.floor(Player.data.size)} FISH:${fishes.length} TOP:${Math.floor(best)}`
            },
            color:"black",
            x:50,
            y:50,
            z:100
        }
    },
    wormSpawner
    ]
}