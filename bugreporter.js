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
  function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
 }

// ===================
// Header: BUGREPORTER
// ===================

// SET UP BUGREPORTER ON PAGE RIGHT CLICK
window.addEventListener("contextmenu", 
    function(e){
        console.log(e);
        BugReporter.execute(e);
        return false;
    }, false);

const BugReporterClass = {
    version: function()  { return "0.0.1" },
    onSave: undefined,
    postURL: undefined,

    init: function() {
        this.createhtml();
    }, 

    execute(e) {
        console.log(e.pageX,' - ',e.pageY);
        elementMouseIsOver = document.elementFromPoint(e.offsetX, e.offsetY);
        console.log("PointXY",elementMouseIsOver);
        console.log(e);
        e.stopPropagation();
        e.preventDefault();
        let scr = this.getScreenShot(elementMouseIsOver);
        scr.then(c => {
            console.log("THEN");
            console.log(scr,c);
            document.getElementById("bugreport-image").innerHTML = "";
            document.getElementById("bugreport-image").appendChild(c);
            this.openPopup("bugreport");
        });
        
    },

    createhtml() {
        // INJECT BUGREPORTER HTML
         document.body.innerHTML = document.body.innerHTML + `
             <div class="body-blackout hide"></div>
            `;
            document.body.innerHTML = document.body.innerHTML + `            
            <div class="modal fade bugreportermodal" id="bugreport" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bugreportermodal="bugreport">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Bug Reporter</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span id="bugreportermodal__close" aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                
                    <span>Please describe what problem you have seen</span><br/>
                    <div class="input-group mb-3">
                        <input type="text" id="bugreporter__description" class="form-control" placeholder="Description" aria-label="Description of Bug" aria-describedby="button-addon2">
                        <div class="input-group-append">
                        <button class="bugreportermodal__close btn btn-primary" type="button" id="bugreporter__save1">Save</button>
                        </div>
                    </div>
                    <div class="small text-muted">A good bug report will include an explanation of what you thought was wrong and an explanation of what you were execting.</div>
                    <div class="bugreport-image" id="bugreport-image"></div>
                </div>
              </div>
            </div>
          </div>`;
        // GET BUGREPORTER BACKGROUND 
        this.bodyBlackout = document.querySelector('.body-blackout');        
        // CREATE CLOSE POPUP EVENTS
        document.querySelector('#bugreportermodal__close').addEventListener('click', (event) => {
            this.save();
            this.closePopup();
        })
        document.querySelector('#bugreporter__save1').addEventListener('click', (event) => {
            this.save();
            this.closePopup();
        });
    },
    openPopup(popupId) {
        const popupModal = document.querySelector(`[data-bugreportermodal="bugreport"]`);
        popupModal.classList.add('visible');
        this.bodyBlackout.classList.add('is-blacked-out');
        popupModal.classList.remove('fade');
    },
    closePopup(popupId) {
        const popupModal = document.querySelector(`[data-bugreportermodal="bugreport"]`);
        popupModal.classList.remove('visible');
        this.bodyBlackout.classList.remove('is-blacked-out');        
        popupModal.classList.add('fade');
    },

    
        // https://stackoverflow.com/questions/13198131/how-to-save-an-html5-canvas-as-an-image-on-a-server
    async save() {
        if (this.onSave) {
            this.onSave(document.getElementById("bugreporter__description"), document.getElementById("bugreport-image"));
        } else if (this.postURL) {
            var canvasData = document.querySelector(".bugreport-image canvas").toDataURL('image/png');
            var inputData = document.getElementById("bugreporter__description").value;
          
            if (window.XMLHttpRequest) {
              ajax = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
              ajax = new ActiveXObject("Microsoft.XMLHTTP");
            }
          
            ajax.open("POST", this.postURL, false);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.onreadystatechange = function() {
              console.log(ajax.responseText);
            }
            ajax.send("desc="+inputData+"&img=" + canvasData);
        }
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
    }
}    

const BugReporter = BugReporterClass;
BugReporter.init();