// Utils
function getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  
  function getHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }

// ===================
// BUGREPORTER
// ===================
// TODO: Make into an object that a user can reference - eg. bugReporter.<method>
// TODO: Post image to server
// TODO: Add object config (url, classes etc)
// TODO: Add popup menu on right click, not immediatly create a but

// SET UP BUGREPORTER ON PAGE RIGHT CLICK
// TODO: Move login into Class
window.addEventListener("contextmenu", 
    function(e){
        console.log(e.pageX,' - ',e.pageY);
        elementMouseIsOver = document.elementFromPoint(e.offsetX, e.offsetY);
        console.log("PointXY",elementMouseIsOver);
        console.log(e);
        e.stopPropagation();
        e.preventDefault();
        let scr = BugReporter.getScreenShot(elementMouseIsOver);
        scr.then(c => {
            console.log("THEN");
            console.log(scr,c);
            document.getElementById("bugreport-image").innerHTML = "";
            document.getElementById("bugreport-image").appendChild(c);
        });
        BugReporter.openPopup("bugreport");
        return false;
        // https://stackoverflow.com/questions/13198131/how-to-save-an-html5-canvas-as-an-image-on-a-server
    }, false);

const BugReporterClass = {
    version: function()  { return "0.0.1" },

    init: function() {
        this.createStyle();
        this.createhtml();
    }, 

    createhtml() {
        // INJECT BUGREPORTER HTML
        document.body.innerHTML = document.body.innerHTML + `
            <div class="body-blackout"></div>
            <div class="bugreportermodal shadow" data-bugreportermodal="bugreport"> 
                <span class="text-white bg-primary bugreportermodal__close" style="right:10px;top:10px">X</span>
                <div class="font-weight-bold bugr-head">Log a Bug Report</div>
                <div id="debugContent">
                    Please describe the error you have identified<br/>
                    <input type="text"></input>
                    <button>Save</button>
                </div>
                <div class="bugreport-image" id="bugreport-image"></image>
            </div>
            `;
        // GET BUGREPORTER BACKGROUND 
        this.bodyBlackout = document.querySelector('.body-blackout');
        // CREATE CLOSE POPUP EVENTS
        document.querySelector('.bugreportermodal__close').addEventListener('click', (event) => {
            popupModal = event.target.closest(".bugreportermodal");
                console.log("close");
                popupModal.classList.remove('is--visible');
                this.bodyBlackout.classList.remove('is-blacked-out');
            })
    },
    openPopup(popupId) {
        const popupModal = document.querySelector(`[data-bugreportermodal="${popupId}"]`);
        popupModal.classList.add('is--visible');
        this.bodyBlackout.classList.add('is-blacked-out');
    },

    // CREATE 50% SCREEN SHOT
    async getScreenShot(elementMouseIsOver) {
        var promise = new Promise(function(resolve, reject) {
            try {
                html2canvas(document.body).then(function(canvas) {
                    //canvas.scale(0.25,0.25);
                    console.log(canvas);
                    var c = document.createElement("canvas");
                    var ctx = c.getContext("2d");
                    c.width=(getWidth()+50)/2;
                    c.height=(getHeight()+50)/2;
                    ctx.width=1000; //getWidth()+50;
                    ctx.height=getHeight()+50;
                    ctx.scale(0.5,0.5);
                    ctx.drawImage(canvas,0,0);
                    // HIGHLIGHT CLICKED ELEMENT
                    ctx.strokeStyle = "#FF0000";
                    ctx.lineWidth = 10;
                    var clientRectangle = elementMouseIsOver.getBoundingClientRect();
                    ctx.beginPath();
                    ctx.rect(clientRectangle.left, clientRectangle.top, clientRectangle.right-10, clientRectangle.bottom-10);
                    ctx.stroke();
                    console.log(ctx);
                    resolve(c);
                }, false);
            } catch(err) {
                reject(Error(err));
            }
        });
        return promise;            
    },

    createStyle() {
        // ADD STYLES TO DOCUMENT
        var styles = `
        .body-blackout {
            position: absolute;
            z-index: 1010;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .65);
            display: none;
            overflow: hidden;
        }
        
        .body-blackout.is-blacked-out {
            display: block;
        }

        .popup-trigger {
        display: inline-block;
        }

        .bugreportermodal {
            height: 365px;
            width: 60%;
            background-color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            padding: 10px;
            opacity: 0;
            pointer-events: none;
            transition: all 300ms ease-in-out;
            z-index: 1011;
            border-radius: 5px;
        }
        .bugreportermodal.is--visible {
            opacity: 1;
            pointer-events: auto;
        }
        
        .bugreportermodal__close {
            position: absolute;
            font-size: 1.2rem;
            right: -10px;
            top: -10px;
            cursor: pointer;
        }
        
        .bugr-head {
            font-size:large;
        }
        
        .bugreport-image {  
            height: 70%;      
            overflow:auto;
            position:absolute;
        }`;
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        console.log("StyleSheet");
    }
}    

const BugReporter = BugReporterClass;
BugReporter.init();