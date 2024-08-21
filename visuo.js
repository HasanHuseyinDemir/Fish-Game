function getPreloadedMedia(method,name){
    let img = //focusedGame.visual.scene.preloaded[method][name] ??
    //focusedGame.preloaded[method][name] ??
    Media.preloaded[method][name];
    if(!img){
        console.error("Visuo Error Preloaded Image : "+name+" is not found! ")
        return
    }
    return img
}

function ev(d,o){
    let output=d
    if(typeof d=="function"){
        output=output(o)
    }
    return output
}


function sharpness(ctx,a){
    ctx.imageSmoothingEnabled = a;
    ctx.mozImageSmoothingEnabled = a;
    ctx.webkitImageSmoothingEnabled = a; 
    ctx.msImageSmoothingEnabled = a;
}

const drawTypes = {
    /**içeri giren objeler içindeki visual objesidir */
    invisible(){},
    shape(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            shape: ev(cf.shape,sG) ?? 'rectangle',
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            z: ev(cf.z,sG) ?? 0,
            color: ev(cf.color,sG) ?? 'black',
            width: ev(cf.width,sG) ?? 100,
            height: ev(cf.height,sG) ?? 100,
            radius: ev(cf.radius,sG) ?? 50,
            points: ev(cf.points,sG) ?? [],
            sides: ev(cf.sides,sG) ?? 3,
            angle: ev(cf.angle,sG) ?? 0,
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };
        if (shapeTypes[obj.shape]) {
            shapeTypes[obj.shape](obj, context); //DRAW FONKSIYONU
        } else {
            console.error(`Visuo Shape Error: Shape type '${obj.shape}' is not defined.`);
        }
    },
    text(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            text: ev(cf.text,sG) ?? 'Text',
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            fontSize: ev(cf.fontSize,sG) ?? 20,
            fontFamily: ev(cf.fontFamily,sG) ?? 'Arial',
            color: ev(cf.color,sG) ?? 'black',
            angle: ev(cf.angle,sG) ?? 0,
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };

        context.save();
        context.font = `${obj.fontSize}px ${obj.fontFamily}`;
        const textWidth = context.measureText(obj.text).width;
        const centerX = obj.x + textWidth / 2;
        const centerY = obj.y - obj.fontSize / 2;
        context.translate(centerX, centerY);
        context.rotate(obj.angle * Math.PI / 180);
        context.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
        context.fillStyle = obj.color;
        context.fillText(obj.text, -textWidth / 2, obj.fontSize / 2);
        context.restore();
    },
    image(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            image: ev(cf.image,sG),
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            width: ev(cf.width,sG), 
            height: ev(cf.height,sG),
            angle: ev(cf.angle,sG) ?? 0, 
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };
        let img=getPreloadedMedia("images",obj.image).media
        if (img) {
            context.save();
            context.translate(obj.x + (obj.width || img.width) / 2, obj.y + (obj.height || img.height) / 2); 
            context.rotate(obj.angle * Math.PI / 180);
            context.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
            
            if (obj.width && obj.height) {
                context.drawImage(img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
            } else {
                context.drawImage(img, -img.width / 2, -img.height / 2);
            }
            context.restore();
        }
    },
    spriteSheet(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            image: ev(cf.image,sG),
            frame: ev(cf.frame,sG) ?? 0, 
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            width: ev(cf.width,sG)??0, 
            height: ev(cf.height,sG)??0,
            angle: ev(cf.angle,sG) ?? 0, 
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };
        let img=getPreloadedMedia("images",obj.image)
        if (img) {
            let frameX = (obj.frame % (img.width / obj.width)) * obj.width;
            let frameY = Math.floor(obj.frame / (img.width / obj.width)) * obj.height;
            context.save();
            context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2); 
            context.rotate(obj.angle * Math.PI / 180); 
            context.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
            context.drawImage(img, frameX, frameY, obj.width, obj.height, -obj.width / 2, -obj.height / 2, obj.width, obj.height); 
            context.restore();
        }
    }
};


const shapeTypes = {
    rectangle(obj, context) {
        context.save(); 
        context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        context.rotate(obj.angle * (Math.PI / 180));
        context.fillStyle = obj.color;
        context.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        context.restore();
    },
    polygon(obj, context) {
        if (obj.sides > 2) {
            context.save();
            context.translate(obj.x, obj.y);
            context.rotate(obj.angle * Math.PI / 180);
            context.fillStyle = obj.color;
            context.beginPath();
            let angle = (Math.PI * 2) / obj.sides;
            for (let i = 0; i < obj.sides; i++) {
                let x = obj.radius * Math.cos(angle * i);
                let y = obj.radius * Math.sin(angle * i);
                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            context.closePath();
            context.fill();
            context.restore();
        } else {
            console.error("Visuo Shape Error: Polygon Must Have More Than 2 Sides");
        }
    },
    triangle(obj, context) {
        context.save();
        context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        context.rotate(obj.angle * Math.PI / 180);
        context.fillStyle = obj.color;
        context.beginPath();
        context.moveTo(0, -obj.height / 2);
        context.lineTo(obj.width / 2, obj.height / 2);
        context.lineTo(-obj.width / 2, obj.height / 2);
        context.closePath();
        context.fill();
        context.restore();
    },
    circle(obj, context) {
        context.save();
        context.translate(obj.x, obj.y);
        context.rotate(obj.angle * Math.PI / 180);
        context.fillStyle = obj.color;
        context.beginPath();
        context.arc(0, 0, obj.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.restore();
    }
};


const rand={
    pick(array){
        let pickIndex=rand.int(0,array.length-1)
        return array[pickIndex]
    },
    bool(){
        return !!rand.int(0,1);
    },
    int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    float(min, max) {
        return Math.random() * (max - min) + min;
    },
    hex() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }
}

const Media={
    preloaded:{
        images:{},
        sounds:{},
    },
    preloadQueue:[],
    preloading:0,
}

async function preloadAll(target,to) {//Target>array>,to<Object>
    Media.preloading++
    const supportedImageFormats = ['jpeg','png','gif','webp'];
    const supportedAudioFormats = ['mp3','wav','ogg', 'aac','m4a','flac'];
    const t=to??Media.preloaded
    const tr=target??Media.preloadQueue
    let loadPromises = tr.map(file => {
      return new Promise((resolve, reject) => {
        let extension = file.src.split('.').pop();
        if (supportedImageFormats.includes(extension)) {
          let img = new Image();
          if(!t.images)t.images={}
          img.onload = () => {
            t.images[file.name] = {
                src:file.src,
                media:img,
            };
            tr.splice([tr.indexOf(file)],1)
            resolve();
          };
          img.onerror = () => reject(`Image file error: ${file.name}`);
          img.src = file.src;
        } else if (supportedAudioFormats.includes(extension)) {
            let audio = new Audio();
            if(!t.sounds)t.sounds={}
            audio.oncanplaythrough = () => {
            t.sounds[file.name] = {
              src:file.src,
              media:audio,
            };
            tr.splice([tr.indexOf(file)],1)
            resolve();
          };
          audio.onerror = () => reject(`Sound file error: ${file.name}`);
          audio.src = file.src;
        } else {
          reject(`This format is supported: ${file.name}`);
        }
      });
    });
  
    try {
        await Promise.all(loadPromises);
    } catch (error) {
        console.error("Preload Error\n", error);
    } finally{
        Media.preloading--
    }
}


function preload(name,src){
    if(name&&src){
      Media.preloadQueue.push({name,src})
      preloadAll()
    }else{
      console.error("Preload Error : Source is not defined")
    }
  }

function layerPriority(x){//X:<Array>
    let nS = false;
    for (let i = 0; i < x.length - 1; i++) {
        if (x[i].visual.z??0 > x[i + 1].visual.z??0) {
            nS = true;
            break;
        }
    }
    if (nS) {
        x.sort((e1, e2) => (e1.visual.z??0) - (e2.visual.z??0));
    }
}

function isF(f,arg){
    return typeof f=="function"?(
        f(arg) , true):
        false
}

function getAdjustedBounds(canvas, e) {
    function map(v,n1,n2,m1,m2){
        return (v-n1)/(n2-n1)*(m2-m1)+m1;
    }
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (document.fullscreenElement) {
        const ratio = window.innerHeight / canvas.height;
        const offset = (window.innerWidth - (canvas.width * ratio)) / 2;
        x = map(e.clientX - rect.left - offset, 0, canvas.width * ratio, 0, canvas.width);
        y = map(e.clientY - rect.top, 0, canvas.height * ratio, 0, canvas.height);
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    return { x, y };
}

const calc={
    angleBetweenPoints(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const angleInRadians = Math.atan2(dy, dx); 
        const angleInDegrees = angleInRadians * (180 / Math.PI); 
        return angleInDegrees;//deg
    },
    collisionDetectRect(o1,o2){
        let ob1={
            x:ev(o1.x)??0,
            y:ev(o1.y)??0,
            width:ev(o1.width)??0,
            height:ev(o1.height)??0
        }
        let ob2={
            x:ev(o2.x)??0,
            y:ev(o2.y)??0,
            width:ev(o2.width)??0,
            height:ev(o2.height)??0
        }
        
        if(ob1.x < ob2.x + ob2.width &&
        ob1.x + ob1.width > o2.x &&
        ob1.y < ob2.y + ob2.height &&
        ob1.y + ob1.height > ob2.y){return true}else{
            return false
        }
    },
    collisionDetectCircle(c1, c2) {
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radiusSum = c1.radius||0 + c2.radius||0;
        return distance <= radiusSum;
    },
    lerp(a1, a2, t) {
        if (a1.length !== a2.length) {
            console.error("Array lengths must match.");
        }
        return arr1.map((val, index) => val + t * (arr2[index] - val));
    },
    distanceBetween(obj1, obj2) {
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

//buradaki oluşturulan game objelerine gönderir
let games = []//oluşturulan bütün oyunlar burada olacak visuo.games ile erişilebilir
let focusedGame//Burası sürekli set edilir
//Canvas onfocus ile devreye girer
//preventdefault kullanıcıya bırakılmıştır
const Controls = {
    totalDown: 0,
    pressFreq:25,
    pressRec: {

    },
}

function press() {
    if (focusedGame && Controls.totalDown > 0) {
        let p = Controls.pressRec
        Object.keys(p).forEach((x) => {
            if (p[x]) {
                control(x, 0, "press")
            }
        })
    }
    setTimeout(requestAnimationFrame(press),Controls.pressFreq)//burası visuo ayarlarından press frekansı değiştirilebilir
}
press()


function control(e, o, s) {
    let g = focusedGame
    if (g) {
        if (g.controls && g.controls[s] && g.controls[s][e]) {
            isF(g.controls[s][e], o);
        }
        if (g.visual && g.visual.scene) {
            let { scene } = g.visual
            if (g.controls && g.controls[s] && g.controls[s][e]) {
                isF(g.controls[s][e], o);
            }
            scene.objects.forEach(x => {
                if (x.controls && x.controls[s] && x.controls[s][e]) {
                    isF(x.controls[s][e], { ...o,self:x });
                }
            });
        } else {
            console.warn("Visuo Warning:Scene is not determined")
        }
    } else {
        console.warn("Visuo Warning:End-Progress")
    }
}


document.addEventListener("keydown", e => {
    if (!Controls.pressRec[e.code]) {
        Controls.totalDown++
        Controls.pressRec[e.code] = true;
        control(e.code, { game: focusedGame, scene: focusedGame.visual.scene, key: e }, "down")
    }
});

document.addEventListener("keyup", e => {
    if (Controls.pressRec[e.code]) {
        Controls.totalDown--
        Controls.pressRec[e.code] = false
        control(e.code, { game: focusedGame, scene: focusedGame.visual.scene, key: e }, "up")
    }
});


// Mouse click recorder
document.addEventListener('mousedown', function (e) {
    const bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    Controls.totalDown++
    switch (e.button) {
        case 0:
            Controls.pressRec.mouseLeft = true
            control("mouseLeft", o, "down")
            break;
        case 1:
            Controls.pressRec.mouseMiddle = true
            control("mouseMiddle", o, "down")
            break;
        case 2:
            Controls.pressRec.mouseRight = true
            control("mouseRight", o, "down")
            break;
    }
});

// Mouse release recorder
document.addEventListener('mouseup', function (e) {
    const bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    Controls.totalDown--
    switch (e.button) {
        case 0:
            Controls.pressRec.mouseLeft = false
            control("mouseLeft", o, "up")
            break;
        case 1:
            Controls.pressRec.mouseMiddle = false
            control("mouseMiddle", o, "up")
            break;
        case 2:
            Controls.pressRec.mouseRight = false
            control("mouseRight", o, "up")
            break;
    }

});

document.addEventListener('mousemove', function (e) {
    let bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    isF(focusedGame.controls.mouseMove, o)
    focusedGame.visual.scene.objects.forEach(x => {
        if (x.controls) {
            isF(x.controls.mouseMove, { ...o, self: x })
        }
    })
});

document.addEventListener('wheel', (e) => {
    let bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    if (e.deltaY < 0) {
        isF(focusedGame.controls.mouseWheelUp, o)
        focusedGame.visual.scene.objects.forEach(x => {
            if (x.controls) {
                isF(x.controls.mouseWheelUp, { ...o, self: x })
            }
        })
    }
    if (e.deltaY > 0) {
        isF(focusedGame.controls.mouseWheelDown, o)
        focusedGame.visual.scene.objects.forEach(x => {
            if (x.controls) {
                isF(x.controls.mouseWheelDown, { ...o, self: x })
            }
        })
    }
});

function ControlsInit(game,canvas) {
    canvas.addEventListener("focus", () => {
        isF(game.hooks.onFocus)
        focusedGame = game
    })
    canvas.addEventListener("blur", () => {
        isF(focusedGame.hooks.onBlur)
        Controls.pressRec={}
        if (focusedGame === game) {
            focusedGame = null
        }
    })
    canvas.addEventListener('mouseover', function (e) {
        let o = { game, scene: game.visual.scene, pos: getAdjustedBounds(canvas, e) }
        isF(game.hooks.onMouseOver, o)
        game.visual.scene.objects.forEach(x => {isF(x.onMouseOver, { ...o, self: x })})
    });
    canvas.addEventListener('mouseLeave', function (e) {
        let o = { game, scene: game.visual.scene, pos: getAdjustedBounds(canvas, e) }
        isF(game.hooks.onMouseLeave, o)
        game.visual.scene.objects.forEach(x => {isF(x.onMouseLeave, { ...o, self: x })})
    });
}

function resizeCanvas(canvasObj,obj){
    const v=canvasObj.visual.canvas
    let diff=(v.width!=obj.width)||(v.height!=obj.height)
    v.width=obj.width||v.width;
    v.height=obj.height||v.height;
    if(diff){
        let call={canvasObj,resized:obj}
        isF(canvasObj.hooks.onResize)
        if(canvasObj.scene){
            isF(canvasObj.scene.onResize,call)
        }
    }
}

function step(){
    let e=focusedGame
    let h=e.hooks
    if(Media.preloading){
        isF(h.onLoading,e.visual.scene)
        if(e.scene){
            isF(e.scene.onLoading,e)
        }
        requestAnimationFrame(step)
        return
    }
    if(e){
        let {canvas,scene}=e.visual
        let t=e.temp
        let context=canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);
        //[STATE] Canvas sayfada değil
        if(!canvas.isConnected){
            t.state=0;
            t.errorMsg="Game is not connected to DOM.";
            isF(e.hooks.isNotConnected,t.errorMsg)
        }
        //[STATE] Canvas çalıştırıldı ama sahne yok 
        if(t.state&&!scene){
            t.state=0;
            t.errorMsg="Scene not determined"
        }
        if(t.errorMsg){
            //e.temp.state=0;
            isF(e.hooks.onError,t.errorMsg)
        }
        //onsceneload ile odaya tekrar geçişte
        if(!scene.isInit){
            scene.isInit=true
            isF(scene.onSceneInit)
        }


        //[STATE] 
        if(!t.state){
            return
        }
        //[STATE] Burası herşey uygun ise 
        if(t.state&&scene){
            scene.objects.forEach(x=>isF(x.onStep,{game:e,scene,self:x}))
                isF(h.begin,e)
                isF(scene.begin,e)
                //z değerleri sıralama
                layerPriority(scene.objects)//burası değiştirilmeli
                scene.objects.map(o=>{
                    let sO={
                        self:o,
                        game:e,
                        scene:scene
                    }
                    /**Zurnanın zırt dediği yer */
                    isF(o.visual.beforeDraw,sO)
                    if(1/*cullingtest yapılması lazım objeye sahnenin kamera pozisyonuna göre*/){
                        drawTypes[o.visual.type](o.visual,context,o,e)
                        isF(o.visual.onDraw,sO)
                    }else{
                        isF(o.visual.onNotDraw,sO)
                    }
                })
                isF(scene.end,e)
                isF(h.end,e)
                   
    }}
    setTimeout(()=>{requestAnimationFrame(step)},e.settings.wait||0)
}

function createGame(obj){
    let specs={
        temp:{
            errorMsg:null,
            state:0,
            focused:0,
        },

        settings:{
            sleep:obj.sleep||null,
            prioritize:obj.prioritize||true,
            wait:obj.wait,
        },

        visual:{
            canvas:document.createElement("canvas"),
            width:obj.width||640,
            height:obj.height||480,
            scene:obj.scene||null,
            //burası sahnede olmalıdır
            camera:{
                x:0,
                y:0,
                offset:{
                    x:0,
                    y:0
                },
                zoom:1
            },
        },

        preloaded:{
            images:{},
            sounds:{}
        },
        
        preload:Array.isArray(obj.preload)?obj.preload:[],

        hooks:{
            isNotConnected:obj.isNotConnected,
            begin:obj.begin,
            end:obj.end,
            onError:obj.onError,
            onLoading:obj.onLoading,
            onStop:obj.onStop,
            onResume:obj.onResume,            
            onSceneChange:obj.onSceneChange,
            onResize:obj.onResize,
            onFullscreen:obj.onFullscreen,
            onFocus:obj.onFocus,
            onBlur:obj.onBlur
        },

        actions:{
            resize(width,height){
                resizeCanvas(specs,{width,height})
            },
            play(){
                focusedGame=specs
                if(!specs.temp.state){
                    specs.temp.state=1
                    specs.temp.errorMsg=null
                    isF(specs.visual.scene.onPlay,specs)
                    step()
                }else{
                    console.warn("Already Running")//[ÇEVİR]
                }
            },
            stop(){
                specs.temp.state=0
                isF(specs.visual.scene.onStop,specs)
                if(focusedGame===specs){
                    focusedGame=null
                }
            },
            nextFrame(){
                this.play();
                this.stop();
            },
            makeSharp(){
                sharpness(specs.visual.canvas.getContext("2d"),false)
            },
            makeSmooth(){
                sharpness(specs.visual.canvas.getContext("2d"),true)
            },
            goFullscreen(){
                let canvas=(specs.visual.canvas)
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen();
                } else if (canvas.mozRequestFullScreen) { // Firefox
                    canvas.mozRequestFullScreen();
                } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari ve Opera
                    canvas.webkitRequestFullscreen();
                } else if (canvas.msRequestFullscreen) { // IE/Edge
                    canvas.msRequestFullscreen();
                }  
            },
            takeScreenshot(){
                let canvas=specs.visual.canvas
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'canvas-image.png';
                link.click();
            },
            mount(query){
                document.querySelector(query).appendChild(specs.visual.canvas)
            },
            cursor:{
                set(arg){specs.visual.canvas.style.cursor=arg},
                hide(){specs.visual.canvas.style.cursor = "none"},
                show(){specs.visual.canvas.style.cursor = "default"}
            },
            searchObjectBy:{
                tag(tag){
                    return specs.visual.scene.objects.filter(e=>{
                        if(e.tags&&Array.isArray(e.tags)&&e.tags.length&&e.tags.includes(tag)&&e){
                            return e
                        }
                    })
                },
                name(name){
                    return specs.visual.scene.objects.map(e=>e.name==name)[0]
                },
                id(id){
                    return specs.visual.scene.objects.map(e=>e.id==id)[0]
                }
            },
            setScene(scene){
                specs.visual.scene=scene
                isF(scene.onSceneSelected,specs)
                scene.preloaded?scene.preloaded={images:{},sounds:{}}:0
                preloadAll(scene.preload,scene.preloaded)
            },
            dispatchEvent(event,arg){
                let events={game:specs,event,arg}
                let {scene}=specs.visual
                if(scene){
                    events.scene=scene
                    if(scene.on&&scene.on[event]){
                        isF(scene.on[event],events)
                    }
                    scene.objects.forEach(x=>{
                        if(x.on&&x.on[event]){
                            isF(x.on[event],{...events,self:x})
                        }
                    })
                }
            },
            destroyObject(obj,arg){
                let {scene}=specs.visual
                if(scene){
                    if(scene.objects.includes(obj)){
                        let os=scene.objects
                        let i=os.findIndex((e)=>e===obj)
                        if(i==-1){
                            console.error("Object not found!")
                            return
                        }else{
                            os.splice(i,1)
                            isF(obj.onDestroy,{game:specs,scene,self:obj,arg})
                        }

                    }
                }else{
                    console.error("Scene not determined!")
                }
            }
        },
        controls:obj.controls||{}
    }

    specs.actions.resize(specs.visual.width,specs.visual.height)
    games.push(specs)
    
    
    ControlsInit(specs,specs.visual.canvas)
    if(specs.preload.length){
        preloadAll(specs.preload,specs.preloaded)
    }
    if(specs.visual.scene&&Array.isArray(specs.visual.scene.preload)&&specs.visual.scene.preload.length){
        preloadAll(specs.visual.scene.preload,specs.visual.scene.preloaded)
    }
    return specs
}

export const visuo={
    createGame,
    currentGame:()=>focusedGame,
    games,
    calc,
    rand,
    createPoint(v = {}) {
            let x = v.x ?? 0;
            let y = v.y ?? 0;
        
            return {
                get x() { return x; },
                set x(a) { x = a; return a; },
                get y() { return y; },
                set y(a) { y = a; return y; },
                add(a) { x += a.x ?? 0; y += a.y ?? 0; },
                sub(a) { x -= a.x ?? 0; y -= a.y ?? 0; },
                mult(a) { x *= a.x ?? 1; y *= a.y ?? 1; },
                scale(scalar) { x *= scalar; y *= scalar; },
                divide(scalar) { if (scalar !== 0) { x /= scalar; y /= scalar; } },
                distance(a) { const dx = x - (a.x ?? 0); const dy = y - (a.y ?? 0); return Math.sqrt(dx * dx + dy * dy); },
                angle(a) {
                    const dotProduct = x * a.x + y * a.y;
                    const magnitudeA = this.magnitude();
                    const magnitudeB = a.magnitude();
                    return Math.acos(dotProduct / (magnitudeA * magnitudeB));
                },
                magnitude() { return Math.sqrt(x * x + y * y); },
                normalize() {
                    const mag = this.magnitude();
                    if (mag !== 0) { x /= mag; y /= mag; }
                },
                lerp(v, t) { const xC = x + t * (v.x - x); const yC = y + t * (v.y - y); x = xC; y = yC; },
                clone() { return createPoint({ x, y }); },
                reset() { x = v.x ?? 0; y = v.y ?? 0; },
                toString() { return `(${x}, ${y})`; },
            };
    },
    createTimer(d,a) {
        let startTime = Date.now();
        let duration=d
        let alarm=a
        return {
            get isCompleted() {
                let comp=Date.now() - startTime >= duration;
                if(typeof alarm=="function"&&comp){
                    alarm()
                }
                return comp
            },
            resetTimer() {
                startTime = Date.now();
            },
            setDuration(newDuration) {
                duration = newDuration;
            },
            restart() {
                this.resetTimer();
            },
            get elapsedTime() {
                return Date.now() - startTime;
            },
            get remainingTime() {
                return Math.max(0, duration - (Date.now() - startTime));
            },
            get duration() {
                return duration;
            },
            setAlarm(f){
                alarm=f
            }
        };
    },
    createInterval(duration,a) {
        let timer = this.createTimer(duration);
        let tickCount=0
        let alarm=a
        return {
            get tickCount(){
                return tickCount
            },
            get isCompleted() {
                if (timer.isCompleted) {
                    timer.resetTimer();
                    if(typeof alarm=="function"){
                        alarm()
                    }
                    tickCount++
                    return true;
                }
                return false;
            },
            resetInterval() {
                timer.resetTimer();
            },
            setDuration(newDuration) {
                timer.setDuration(newDuration);
            },
            restart() {
                timer.restart();
            },
            get elapsedTime() {
                return timer.elapsedTime;
            },
            get remainingTime() {
                return timer.remainingTime;
            },
            get duration() {
                return timer.duration;
            },
            setAlarm(f){
                alarm=f
            }
        };
    },
    preload,
    drawTypes,
    shapeTypes,
    sound(name){return getPreloadedMedia("sounds",name).media},
    image(name){return getPreloadedMedia("images",name).media},
}