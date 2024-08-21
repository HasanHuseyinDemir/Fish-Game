import { background } from "../Objects/background.js"
import { gameScene } from "./gameScene.js"

const text={
    visual:{
        type:"text",
        text:"Oyuna Başlamak İçin Space Tuşuna Basın.\n                'F' Tuşuna Basarak Tam Ekran Oynayabilirsiniz <HHD>",
        fontSize:12,
        color:"white",
        x({game}){
            return game.visual.canvas.width/5
        },
        y({game}){
            return game.visual.canvas.height/1.05
        }
        
    },
    controls:{
        down:{
            Space({game}){
                game.actions.setScene(gameScene)
            }
        }
    }
}


export const menuScene={
    objects:[
        background,
        text,
        {visual:{
            type:"text",
            text:"Balık Oyunu",
            fontSize:32,
            color:"black",
            align:"center",
            x({game}){
                return game.visual.canvas.width/2.5
            },
            y({game}){
                return 100
            }
            
        }},
    ]
}