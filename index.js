import { game } from "./game.js";
import { visuo } from "./visuo.js";


visuo.preload("bg","./Assets/bg.png")
visuo.preload("player","./Assets/player.png")

visuo.preload("worm","./Assets/worm.png")

//Düşmanlar
visuo.preload("ghost","./Assets/ghost.png")
visuo.preload("e1","./Assets/e1.png")
visuo.preload("e2","./Assets/e2.png")
visuo.preload("e3","./Assets/e3.png")
visuo.preload("e4","./Assets/e4.png")
visuo.preload("e5","./Assets/e5.png")
visuo.preload("e6","./Assets/e6.png")
visuo.preload("e7","./Assets/e7.png")
visuo.preload("e8","./Assets/e8.png")

//sound Effects
visuo.preload("bgMusic","./Assets/Music/bgMusic.mp3")
visuo.preload("bub0","./Assets/Music/bub0.mp3")
visuo.preload("bub1","./Assets/Music/bub1.mp3")
visuo.preload("bub2","./Assets/Music/bub2.mp3")
visuo.preload("bub3","./Assets/Music/bub3.mp3")
visuo.preload("bub4","./Assets/Music/bub4.mp3")
visuo.preload("bub5","./Assets/Music/bub5.mp3")
visuo.preload("bub6","./Assets/Music/bub6.mp3")
visuo.preload("bub7","./Assets/Music/bub7.mp3")
visuo.preload("nom","./Assets/Music/nom.mp3")
visuo.preload("poit","./Assets/Music/poit.mp3")

game.actions.mount("#gameContainer")
game.actions.play()