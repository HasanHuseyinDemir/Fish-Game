export const background={
    visual:{
        type:"image",
        image:"bg",
        x:0,
        y:0,
        z:-100,
        width({game}){
            return game.visual.canvas.width
        },
        height({game}){
            return game.visual.canvas.height
        }   
    }
}