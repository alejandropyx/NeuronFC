
  let scene, camera, renderer;
  var model;
        function init() {
          scene = new THREE.Scene();
          scene.background = new THREE.Color(0x000000);
          camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000);
          
          camera.position.x = -100;
          camera.position.y = 0;
          camera.position.z = 0;
          camera.rotation.y = 0;
       
          

          console.log(camera)
  
  
          renderer = new THREE.WebGLRenderer({antialias:true});
          renderer.setSize(window.innerWidth/2,window.innerHeight/2);
          //document.body.appendChild(renderer.domElement);
  
          controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.addEventListener('change', renderer);  

        
          directionalLight = new THREE.DirectionalLight(0xffdddd,0.5);
          directionalLight.position.set(300,300,300);
          directionalLight.castShadow = true;
          scene.add(directionalLight);

          light = new THREE.PointLight(0xff00ff,1);
          light.position.set(0,-100,0);
          scene.add(light);

         

          
          
          let loader = new THREE.GLTFLoader().setPath( './' );
          
          loader.load('scene3.gltf', gltf=> {

            

            gltf.scene.rotation.y=Math.PI ;

  
            model = gltf.scene; 

         

            //model.scale.x=0.5;
            //model.scale.y=0.5;
            //model.scale.z=0.5;




            model.traverse(n => { if ( n.isMesh ) {
            n.castShadow = true; 
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 1;
            }});
  
          
             
              scene.add(gltf.scene);
              renderer.render(scene,camera);
            
            animate();
          });
        }
        function animate() {
          //controls.update();
          requestAnimationFrame(animate);
         // controls.update();
         
          renderer.render(scene,camera);
        }
        init();  

        function onDocumentMouseUp(event) {
          console.log(event)
          if(event===undefined)
          event = window.event;
          console.log(event)
          event.preventDefault();

          var mouse = new THREE.Vector2()
          var raycaster = new THREE.Raycaster();
          
          mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
          mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
          raycaster.setFromCamera( mouse.clone(), camera );   
          
          var objects = raycaster.intersectObjects(scene.children);
      
          //var mouse3D = getMousePosition(event.clientX, event.clientY);
          //console.log(mouse);
          //console.log(raycaster);
          //console.log(objects);
      

      }
      function getMousePosition(clientX, clientY) {
        var mouse2D = new THREE.Vector3();
        var mouse3D = new THREE.Vector3();
        mouse2D.x = (clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = -(clientY / window.innerHeight) * 2 + 1;
        mouse2D.z = 0.5;
        return mouse2D;
        mouse3D = projector.unprojectVector(mouse2D.clone(), camera);
        return mouse3D;

    }

  

var graph = {};




var node = []
var Atlas1=[]



    $.ajax({
      type: "GET",
      url: "Locations2.json",
      dataType: "text",
      success: function(data) {Atlas1 = JSON.parse(data);}
   });

   $.ajax({
    type: "GET",
    url: "Locations.json",
    dataType: "text",
    success: function(data) { getLocationsNeurons(data)}
 });

 function getLocationsNeurons(data){

  var text="";
  var number=0;

  var objectsJson=JSON.parse(data);

  console.log(objectsJson)

  var xp= 1000000 ;
      var yp= 1000000;
      var zp= 1000000 ;
var error = 0.01;


  objectsJson[0].nodes.forEach( function(element,index){

    var row="";


    if(element.hasOwnProperty('translation')  ){

      var xf= parseFloat(element.translation[0])*-10 ;
      var yf= parseFloat(element.translation[1])*10 ;
      var zf= parseFloat(element.translation[2])*-10 ;

      
//Math.abs(xf - xp) > error || Math.abs(yf - yp) > error || Math.abs(zf - zp) > error
      if( true  ){


        xp=xf
        yp=yf
        zp=zf

        var x= (xf).toString() ;
        var y= (yf).toString() ;
        var z= (zf).toString() ;

        var pos ='"	,	"fy"	:	'+y+'	,	"fz"	:	'+z+'	,	"fx"	:	'+x+'	}	,'

        row= '{"id":'+number+'	,	"name":"N'+number+element.name+pos;
        
        if(!text.includes(pos)){
          number+=1;
          text = text+row+'\n'
        }
        
      }


    }

  
      

    
  } );

  text = '['+text.trim(',')+']';

  console.log(text)


 }


   $(document).ajaxComplete(function( event, xhr, settings ) {   

        graph = {

          nodes: Atlas1,
          links:[...Array(76).keys()]
                .filter(id => id)
                .map(id => ({
                  source: id>28? Math.floor(Math.random() * (20)) : id ,
                  target: Math.round(Math.random() * (  (id>28? Math.floor(Math.random() * (20)+1) : id) -1)),
                  value: Math.random() * 4
                }))


        }
        /*
        const N = 300;
        graph = {
          nodes: [...Array(N).keys()].map(i => ({ id: i })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round(Math.random() * (id-1))
            }))
        };*/


        console.log(graph)


            ReGraph(graph)



    

   })


   function ReGraph(graph){

    const highlightNodes = new Set();
    const highlightLinks = new Set();
    let hoverNode = null;

    
    // (document.getElementById('3d-graph')).graphData(graph);

    const elem = document.getElementById('3d-graph');
    const Graph = ForceGraph3D()

(elem)   
.graphData(graph)          
  .nodeLabel('name')
  .enableNodeDrag(true)
  .nodeColor(node => highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,160,0,0.8)' : 'rgba(255,218,0,1)')
  .linkWidth(link => highlightLinks.has(link) ? link.value : 0.5 )
  .nodeThreeObject(node => {
    /*
    const sprite = new SpriteText(node.id);
    sprite.material.depthWrite = true; // make sprite background transparent
    sprite.color = 'rgb(255,0,0,1)';
    sprite.textHeight = 8;
    return sprite;
    */
  })
  .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
  .onNodeHover(node => {          // no state change
    if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;

    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);

      
      graph.links.forEach(link => {

        if (link.source.id == node.id || link.target.id == node.id ){
        
        highlightLinks.add(link)
      highlightNodes.add(link.source)
      highlightNodes.add(link.target)

        }         
    
    });          }

    hoverNode = node || null;

    updateHighlight();
  })
  .onLinkHover(link => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  })
  .onNodeClick(node => {
    // Aim at node from outside it
    const distance = 200;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    console.log(node)

    Graph.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      1000  // ms transition duration
    );
  });

    console.log(Graph.scene())
  Graph.scene().position.x=0
  Graph.scene().position.y=0
  Graph.scene().position.z=0
  Graph.scene().zoom+=0

  console.log(Graph.scene())

  Graph.scene().add(scene);

  Graph.cameraPosition(
{ x: -200, y: 100, z:-200  }, // new position
      {x:0,y:0,z:0} // lookAt ({ x, y, z })
)

  function updateHighlight() {
// trigger update of highlighted objects in scene
Graph
  .nodeColor(Graph.nodeColor())
  .linkWidth(Graph.linkWidth())
}
   }



   function download() {
    var element = document.createElement('a');
    var text = "";
    $.ajax({
      type: "GET",
      url: "matTemP.csv",
      dataType: "text",
      success: function(data) {text = data;
      
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'ExampleName.csv');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);



      }
   });
   
}

  function loadFileAsText(){
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        CSV2Array(textFromFileLoaded);
        document.getElementById("content-target").value = textFromFileLoaded;
    };

    fileReader.readAsText(fileToLoad, "UTF-8");
  }

  function CSV2Array(csv){
        var lines = csv.split("\n");
        var titles = lines[0].split(" ");
        var data = [];
        for (var i = 0; i < lines.length; i++) {
          data.push(lines[i].split(","));
          
        }
        
        arrar2Links(data)
    }

    function arrar2Links(data){

      console.log(graph) 

      graph.links=[];

      var th =parseFloat($("#myInput").val());

      console.log(th)

      for (i = 0; i < 75; i++) {
        for (j=i+1 ; j < 75; j++) {
          
          
          if ( parseFloat(data[i][j])  < th)
            continue;

          graph.links.push({

            source :  i ,
            target : j

          })

          //console.log(data[i][j]) ;
          }
      }

      graph.links.filter(id => id)
                .map(id => ({
                  source: id
                }))
      
      ReGraph(graph)


    }


   



