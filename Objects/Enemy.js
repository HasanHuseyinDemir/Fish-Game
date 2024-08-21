import { visuo } from "../visuo.js"
import { growRate, Player } from "./Player.js"

let index=0;

const EnemyMoveCombinations = {
    xInc(obj, speed,f) {
        obj.data.x += speed
        obj.visual.flipX = true
        f?"":obj.data.size-=0.001
    },
    xDec(obj, speed,f) {
        obj.data.x -= speed
        obj.visual.flipX = false
        f?"":obj.data.size-=0.001
    },
    yInc(obj, speed,f) {
        obj.data.y += speed
        f?"":obj.data.size-=0.001
    },
    yDec(obj, speed,f) {
        obj.data.y -= speed
        f?"":obj.data.size-=0.001
    },
    stable() {},
    diagonalPositive(obj, speed,f) {
        obj.data.x += speed
        obj.visual.flipX = true
        obj.data.y += speed
        f?"":obj.data.size-=0.002
    },
    diagonalNegative(obj, speed,f) {
        obj.data.x -= speed
        obj.visual.flipX = false
        obj.data.y -= speed
        f?"":obj.data.size-=0.002
    },
    diagonalXy(obj, speed,f) {
        obj.data.x += speed
        obj.visual.flipX = true
        obj.data.y -= speed
        f?"":obj.data.size-=0.002
    },
    diagonalxY(obj, speed,f) {
        obj.data.x -= speed
        obj.visual.flipX = false
        obj.data.y += speed
        f?"":obj.data.size-=0.001
    }
}

let enemyFishSpriteNames = ["e1", "e2", "e3", "e4","e5","e6","e7","e8"];

export const spawned={
    egg:0,
    fish:0,
}

export function createEgg(id,image,pos){
    spawned.egg++
    let eggmoves=["diagonalxY","diagonalPositive","yInc"];
    function pickRandomMove(){
        return EnemyMoveCombinations[visuo.rand.pick(eggmoves)]
    }
    let incubation
    let egg = {
        visual:{
            type:"shape",
            shape:"circle",
            color:(image=="e1"?"cyan":image=="e2"?"yellow":image=="e3"?"brown":image=="e4"?"black":"white"),
            radius:visuo.rand.float(2,3),
            x(){
                return egg.data.x
            },
            y(){
                return egg.data.y
            },
            opacity:0.5,
            z:0,
        },
        data:{
            id:id,
            image:image,
            moveTimer:visuo.createInterval(1000),
            moveComb:pickRandomMove(),
            birthable:false,
            x:pos.x,
            y:pos.y,
            speed:0.1
        },
        onStep({game}){
            let canvas=game.visual.canvas
            if(egg.data.moveTimer.isCompleted){
                egg.data.moveComb=pickRandomMove()
                egg.data.speed=visuo.rand.float(0.1,0.3)
            }
            if(egg.data.y>canvas.height-5){
                egg.data.y=canvas.height-5
                egg.data.birthable=true
                if(!incubation){
                    incubation=visuo.createTimer(visuo.rand.int(5000,25000))
                }
            }
            if(egg.data.x>canvas.width){
                egg.data.x=canvas.width
            }
            if(egg.data.x<0){
                egg.data.x=0
            }
            if(egg.data.y<0){
                egg.data.y=0
            }


            

            if(incubation&&incubation.isCompleted){
                if(visuo.rand.bool()){
                    game.visual.scene.objects.push(createEnemy(id,image,{x:egg.data.x,y:egg.data.y},visuo.rand.int(10,25)))
                }
                game.actions.destroyObject(egg)
            }
            egg.data.moveComb(egg,egg.data.speed,true)
        },
    }
    return egg
}

export function createEnemy(i,img,pos,size) {
    spawned.fish++
    let lifeCycleTime;
    let luck = visuo.rand.bool();
    let moveTimer = visuo.createTimer(randomMoveTimer()); // Karar
    let ghostTime = visuo.createTimer(2000);
    let started = false;

    function startLife() {    
        lifeCycleTime = visuo.createTimer(visuo.rand.int(2000, 10000));
    }

    function randomMoveTimer() {
        return visuo.rand.int(4000, 10000);
    }

    function randSpeed() {
        return visuo.rand.float(0.5, 1);
    }

    function pickRandomMovement() {
        const keys = Object.keys(EnemyMoveCombinations);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        return EnemyMoveCombinations[randomKey];
    }

    function findNearestEnemy(currentEnemy, enemies) {
        let nearestEnemy = null;
        let minDistance = Infinity;

        enemies.forEach(enemy => {
            if (enemy !== currentEnemy && enemy.data.state === currentEnemy.data.state) {
                const distance = visuo.calc.distanceBetween(currentEnemy.visual, enemy.visual);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        });

        return nearestEnemy;
    }

    function selectMoveCombination(currentEnemy, nearestEnemy) {
        const dx = nearestEnemy.visual.x - currentEnemy.visual.x;
        const dy = nearestEnemy.visual.y - currentEnemy.visual.y;

        if (dx > 0 && dy > 0) {
            return EnemyMoveCombinations.diagonalPositive;
        } else if (dx < 0 && dy > 0) {
            return EnemyMoveCombinations.diagonalxY;
        } else if (dx > 0 && dy < 0) {
            return EnemyMoveCombinations.diagonalXy;
        } else if (dx < 0 && dy < 0) {
            return EnemyMoveCombinations.diagonalNegative;
        } else if (dx > 0) {
            return EnemyMoveCombinations.xInc;
        } else if (dx < 0) {
            return EnemyMoveCombinations.xDec;
        } else if (dy > 0) {
            return EnemyMoveCombinations.yInc;
        } else if (dy < 0) {
            return EnemyMoveCombinations.yDec;
        } else {
            return EnemyMoveCombinations.stable;
        }
    }

    const enSmallTimer=visuo.createInterval("1000")

    const Enemy = {
        visual: {
            type: "image",
            image: "ghost",
            get width() {
                return Enemy.data.size;
            },
            get height() {
                return Enemy.data.size / 2;
            },
            get x() {
                return Enemy.data.x;
            },
            get y() {
                return Enemy.data.y;
            },
            set x(a) {
                if (a < 0) {
                    Enemy.visual.flipX = false;
                } else {
                    Enemy.visual.flipX = true;
                }
                Enemy.data.x = a;
            },
            set y(a) {
                Enemy.data.y = a;
            },
            z:1,
            flipX: true,
        },
        data: {
            x:(pos?pos.x:0)||visuo.rand.int(0, 890),
            y:(pos?pos.y:0)||visuo.rand.int(0, 590),
            size: null,
            speed: 1,
            sprite: img??visuo.rand.pick(enemyFishSpriteNames),
            state: "GHOST",
            moveComb: null,
            started:new Date(),
            eatCount:0,
            id:(i?i:index++)
        },
        onStep({ game }) {
            if (ghostTime.isCompleted && !started) {
                Enemy.data.state = "ENEMY";
                Enemy.visual.image = Enemy.data.sprite;
                started = true;
                startLife();
                visuo.sound("poit").play();
            }

            if (moveTimer.isCompleted) {
                const enemies = game.actions.searchObjectBy.tag("enemy");
                const nearestEnemy = findNearestEnemy(Enemy, enemies);

                if (nearestEnemy) {
                    Enemy.data.moveComb = selectMoveCombination(Enemy, nearestEnemy);
                } else {
                    Enemy.data.moveComb = pickRandomMovement();
                }

                Enemy.data.speed = randSpeed();
                moveTimer.setDuration(randomMoveTimer());
                moveTimer.restart();
            }

            if (Enemy.data.moveComb) {
                Enemy.data.moveComb(Enemy, Enemy.data.speed);
            }

            game.actions.searchObjectBy.tag("enemy").forEach((e) => {
                if (visuo.calc.collisionDetectRect(e.visual, Enemy.visual)) {
                    if (((Enemy.data.size > e.data.size) && 
                    
                    e.data.state === Enemy.data.state)
                    
                    &&(e.data.id!=Enemy.data.id)) {
                        Enemy.data.size += growRate(e.data.size);
                        game.actions.destroyObject(e);
                        Enemy.data.eatCount++
                        if(Enemy.data.eatCount>50&&Enemy.data.size>300){
                            Enemy.data.state="GHOST"
                            Enemy.tags=["ghost"]
                            Enemy.data.speed=0
                            Enemy.visual.image="ghost"
                            visuo.sound("bub7").play()
                        }else if(Enemy.data.eatCount>visuo.rand.int(3,5)){
                            if(visuo.rand.int(0,3)==3){
                                for(let j=0;j<visuo.rand.int(6,24);j++){
                                    Enemy.data.eatCount=0
                                    game.visual.scene.objects.push(createEgg(Enemy.data.id,Enemy.data.sprite,{x:Enemy.data.x,y:Enemy.data.y}))
                                }
                                Enemy.data.size-=3
                                visuo.sound("bub6").play()
                            }
                        }

                        
                    }
                }
            });

            if((Enemy.data.size>200)&&enSmallTimer.isCompleted){
                Enemy.data.size-=0.3
            }

            let { canvas } = game.visual;
            let data = Enemy.data;
            if (data.x > canvas.width - data.size) {
                data.x = canvas.width - data.size;
                Enemy.data.moveComb = pickRandomMovement();
            }
            if (data.y > canvas.height - data.size / 2) {
                data.y = canvas.height - data.size / 2;
                Enemy.data.moveComb = pickRandomMovement();
            }
            if (data.x < 0) {
                Enemy.data.moveComb = pickRandomMovement();
                data.x = 0;
            }
            if (data.y < 0) {
                Enemy.data.moveComb = pickRandomMovement();
                data.y = 0;
            }
        },
        onDestroy() {
            visuo.sound("bub1").play();
        },
        tags: ["enemy","fish"]
    };

    if(!size){
        if (luck) {
            let able = Player.data.size > 300 ? visuo.rand.int(120,300) : Player.data.size;
            Enemy.data.size = visuo.rand.int(10, able);
        } else {
            let secondLuck = visuo.rand.int(0, 100);
    
            if (secondLuck < 10) {
                Enemy.data.size = visuo.rand.int(170, 200);
            } else if (secondLuck < 20) {
                Enemy.data.size = visuo.rand.int(150, 200);
            } else {
                Enemy.data.size = visuo.rand.int(10, 20);
            }
        }
    }else{
        Enemy.data.size=size
    }


    return Enemy;
}
