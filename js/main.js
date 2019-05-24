var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

function checkInput() {
    var searchBox = document.getElementById("searchFieldBox");
    searchBox.classList.remove("searchActive");
    searchBox.classList.add("searchNotActive");




    var input = document.getElementById("searchField").value;
    if (input.length > 0) {

        searchBox.classList.add("searchActive");
        searchBox.classList.remove("searchNotActive");

        getJSON('http://167.99.130.232/powerfiles/searchTree.php?query=' + input,
            function(err, data) {
                if (err !== null) {
                    alert('Something went wrong: ' + err);
                } else {
                    console.log(data.status)
                    if (data.status == "false") {
                        document.getElementById("results").innerHTML = '<hr><div class="ClassResultsMultiple"><h2>Ingen resultater</h2></div>';
                    } else {
                        document.getElementById("results").innerHTML = '';
                        data.results.forEach(function(entry) {
                            document.getElementById("results").innerHTML = document.getElementById("results").innerHTML + '<hr><div class="ClassResultsMultiple" onClick="clickSearchelement(\'tree' + entry.treeNumber + '\')"><h2>' + entry.rank + ' ' + entry.navn + ' | ' + timeConverter(entry.datePlanted) + '</h2></div>';
                        })
                    }

                    document.getElementById("results").style.removeProperty("display");
                }
            });


    } else {
        document.getElementById("results").style.display = "none";
    }
}

function clickSearchelement(tree) {
    var input = document.getElementById("searchField").value = "";
    checkInput()
    document.getElementById(tree).click();
}
var v3 = [
    [8.240148, 55.618219],
    [8.245984, 55.620864]
];
mapboxgl.accessToken = '';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lukasw1337/cjvwu7t3v55ie1dqadbhwufil',
    center: [8.242974, 55.619665],
    zoom: 17,
    minZoom: 18,
    maxZoom: 20,
    maxBounds: v3
});
let TheBox = document.getElementById("TheBox");
let closeButtonInfo = document.getElementById("closeButtonInfo");

//Javagars funktioner

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000); //Vi laver et Unix timestamp om til javascript time element.
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']; //Array med måneder som det kan være
    var year = a.getFullYear(); //Vi får det fulde årstal
    var month = months[a.getMonth()]; //Finder måneden, og bruger det til at vælge måneden fra vores array
    var date = a.getDate(); //Henter datoen

    var time = date + ' ' + month + ' ' + year; //Vi sætter strengen sammen i formatet vi vil have
    return time; // og retunere det
}

function calculateAge(datePlanted) {
    var theDate = new Date(datePlanted * 1000); //Første årstallet hvor det er plantet
    var ageDifMs = Date.now() - theDate.getTime(); //Så finder vi års
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//Javagar's funktioner

map.on('load', function() {

    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"],
                ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"],
                ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': 1
        }
    }, labelLayerId);
});
getJSON('http://167.99.130.232/powerfiles/getTrees.php',
    function(err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            loadmarkers(data);
        }
    });
var mapMarkers = [];
var allMarkers = [];

function loadmarkers(data) {
    console.log("Startin adding");
    allMarkers = data;
    for (var key in allMarkers) {
        var point1 = parseFloat(allMarkers[key].lat);
        var point2 = parseFloat(allMarkers[key].lng);
        var numba = parseFloat(allMarkers[key].numba);

        var x = document.createElement("IMG");
        x.setAttribute("src", "img/tree-solid-new.svg");
        x.setAttribute("width", "35");
        x.setAttribute("height", "53");

        new mapboxgl.Marker({
                element: x
            })
            .setLngLat([point2, point1])
            .addTo(map)
            .getElement()
            .id = "tree" + numba;
        document.getElementById("tree" + numba).addEventListener('click', _markerOnClick);


        //mapMarkers.push(mapboxgl.Marker.setLngLat([point1, point2]).addTo(mymap));
        console.log("Pushed one");

    }

}
var activeLine = 0;
var _markerOnClick = function(e) {

    document.getElementById("contentInInfoBox").style.display = "none";
    document.getElementById("InfoBoxLoader").style.removeProperty("display");
    var ret = e.target.id.replace('tree', '');
    getJSON('http://167.99.130.232/powerfiles/getTree.php?tree=' + ret,
        function(err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                fillTheBox(data);
            }
        });

    TheBox.style.removeProperty("display");

    setTimeout(function() {
        TheBox.style.opacity = 1;
    }, 2);


    if (activeLine != 0) {
        activeLine.remove();
        activeLine = 0;
    }

    var line = new LeaderLine(
        e.target,
        document.getElementById('TheBox'), {
            dropShadow: true,
            size: 8,
            color: '#333'
        }
    );
    activeLine = line;

    map.on('move', function() {
        updateLineYes();
    });
};

function fillTheBox(data) {
    var info = data;

    document.getElementById("treeNumber").innerHTML = "Træ nr. " + info.treeNumber;
    document.getElementById("ranking").innerHTML = info.rank;
    document.getElementById("personName").innerHTML = info.navn;
    document.getElementById("datePlant").innerHTML = timeConverter(info.datePlanted);
    document.getElementById("YearSince").innerHTML = "(" + calculateAge(info.datePlanted) + " år siden)";
    document.getElementById("infoCardText").innerHTML = info.text;
    document.getElementById("profileImage").src = info.image;

    if (info.link != "") {
        document.getElementById("RefbuttonOut").href = info.link;
        document.getElementById("RefbuttonOut").style.removeProperty("display");
    } else {
        document.getElementById("RefbuttonOut").style.display = "none";
    }


    setTimeout(function() {
        document.getElementById("InfoBoxLoader").style.display = "none";
        document.getElementById("contentInInfoBox").style.removeProperty("display");
		updateLineYes();
    }, 300)


}

function updateLineYes() {
    if (activeLine != 0) {
        activeLine.position();
    }
}

function close() {
    TheBox.style.opacity = 0;
    setTimeout(function() {
        TheBox.style.display = "none";
    }, 400);

    activeLine.remove();
    activeLine = 0;
}
document.getElementById("closeButtonInfo").onclick = function() {
    close();
}

function loader() {
    let loader = document.getElementById("Loader");
    let lLeft = document.getElementById("lLeft");
    let lRight = document.getElementById("lRight");

    lLeft.style.transform = "translate(-100%";
    lRight.style.transform = "translate(100%)";

    console.log("I should be gone");
}
window.addEventListener("load", function() {
    setTimeout(loader, 500);
    console.log("TimeSet");
}); // JavaScript Document