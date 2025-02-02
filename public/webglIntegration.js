let unityInstance = null;
let canvas = null;
let unityCallback = null;
let apiKey = null;

async function initWebgl(key = '783bc790d5fa33a4aea237b54b8226d8-678907f2f2710732f532b56bfc9f0bb8') {
    if(!key) throw 'api key required to initilize the webgl';
    apiKey = key;
    canvas = document.createElement('canvas');
    canvas.id = 'unityCanvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '50px';
    canvas.style.left = '50px';
    canvas.style.width = "275px";
    canvas.style.height = "185px";
    canvas.style.border = "1px solid black";
    canvas.style.cursor = "grab";

    document.body.appendChild(canvas);
    
    makeCanvasDraggable(canvas);
    var buildUrl = `https://webgl-integration-h1ngdb69q-awais-projects-4c25e204.vercel.app/Build`;
    var loaderUrl = buildUrl + "/webglbuild.loader.js";
    var config = {
        dataUrl: buildUrl + "/webglbuild.data",
        frameworkUrl: buildUrl + "/webglbuild.framework.js",
        codeUrl: buildUrl + "/webglbuild.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Deaftawk",
        productName: "Translate",
        productVersion: "0.1",
    };

    var script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
        }).then((instance) => {
            unityInstance = instance;
        }).catch((message) => {
            alert(message);
        });
    };

    document.body.appendChild(script);
}


function makeCanvasDraggable(canvas) {
    let offsetX, offsetY, isDragging = false;

    canvas.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - canvas.offsetLeft;
        offsetY = event.clientY - canvas.offsetTop;
        canvas.style.cursor = "grabbing";
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            canvas.style.left = event.clientX - offsetX + 'px';
            canvas.style.top = event.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = "grab";
    });
}

function toggleWebgl() {
    if (canvas) {
        canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
    }
}

function playPose(text, callback) {
    if (unityInstance) {
        unityCallback = callback;
        const unityData = {text,
            baseUrl: 'https://translateai.deaftawk.com:3001',
            character: 0,
            nextFrameTime: 0.025,
            apiKey: apiKey};
        unityInstance.SendMessage('NetworkManager', 'RecievePoseText', JSON.stringify(unityData));
    } else {
        console.log('waiting for unityinstance');
        setTimeout(()=>{
         playPose(text, callback);
        },1000);
    }
}

function onDataRecieved(message) {
    if (typeof unityCallback === 'function') {
        unityCallback();
    }
    console.log('confirmation from unity', message);
}

function handleWebglError (error){
    if (typeof unityCallback === 'function') {
        unityCallback();
    }
    console.error('WEBGL-ERROR ----> ', error);
}
