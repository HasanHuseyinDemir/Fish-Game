import { background } from "../Objects/background.js";
import { visuo } from "../visuo.js";

export const gameOver={
    onSceneInit(){
        visuo.sound("bgMusic").pause()
        visuo.sound("bub5").play()
    },
    objects:[
        background,
        {
            visual:{
                type:"text",
                text:"Oyun Bitti! Yeniden başlamak için sayfayı yenileyin",
                color:"white",
                x:100,
                y:500,
                fontSize:32,
            }
        }
    ]
}