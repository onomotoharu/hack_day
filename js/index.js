// Adding 500 Data Points
var map, pointarray, heatmap;

var hotData = [
  new google.maps.LatLng(35.6662026, 139.7312591)
];

function initialize() {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(35.6662026, 139.7312591)
  };

  map = new google.maps.Map(document.getElementById('heatmap'),
      mapOptions);

  var pointArray = new google.maps.MVCArray(hotData);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
  });

  heatmap.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);



///=====



var io = new WebSocketIO("ws://winvelab.net:9000").connect();

// 国ごとに表示するべき色の取得
io.on("synccolor", function(data) {
	console.log("color" + " - " + JSON.stringify(data));
});


// 応援されている場所を取得
io.on("heatmap", function(data) {

	data.location.forEach(function(point){
		point = JSON.parse(point);
		hotData.push(new google.maps.LatLng(point.latitude, point.longitude) )
	});
});

// 応援されている国を取得

io.on("liveliness", function(data) {

var countryliveliness = [
		  {
		    name: 'USA',
		    radius: 0,
		    fillKey: 'USA',
		    latitude: 47.606390,
		    longitude: -122.330830
		  },{
		    name: 'GreatBritain',
		    radius: 0,
		    fillKey: 'RUS',
		    latitude: 51.508967,
		    longitude: -0.126127
		  },{
		    name: 'France',
		    radius: 0,
		    fillKey: 'FRA',
		    latitude: 48.852840,
		    longitude: 2.349857
		  },{
		    name: 'German',
		    radius: 0,
		    fillKey: 'GER',
		    latitude: 52.524268,
		    longitude: 13.406290
		  },{
		    name: 'Japan',
		    radius: 0,
		    fillKey: 'JPN',
		    latitude: 35.681382,
		    longitude: 139.766084
		  },{
		    name: 'Italia',
		    radius: 0,
		    fillKey: 'ITA',
		    latitude: 45.471156,
		    longitude: 9.185727
		  },{
		    name: 'Canada',
		    radius: 0,
		    fillKey: 'CAN',
		    latitude: 45.411572,
		    longitude: -75.698194
		  },{
		    name: 'Rusia',
		    radius: 0,
		    fillKey: 'RUS',
		    latitude: 59.951889,
		    longitude: 30.453329
		  },{
		    name: 'China',
		    radius: 0,
		    fillKey: 'CHN',
		    latitude: 31.247869,
		    longitude: 121.472702
		  },{
		    name: 'India',
		    radius: 0,
		    fillKey: 'IND',
		    latitude: 28.637690,
		    longitude: 77.205824
		  },{
		    name: 'Brazil',
		    radius: 0,
		    fillKey: 'BRA',
		    latitude: -22.909370,
		    longitude: -43.214998
		  },{
		    name: 'Mexico',
		    radius: 0,
		    fillKey: 'MEX',
		    latitude: 19.410636,
		    longitude: -99.130588
		  },{
		    name: 'Republic of South Africa',
		    radius: 0,
		    fillKey: 'RSA',
		    latitude: -33.924788,
		    longitude: 18.429916
		  },{
		    name: 'Australia',
		    radius: 0,
		    fillKey: 'AUS',
		    latitude: -37.809575,
		    longitude: 144.965186
		  },{
		    name: 'Korea',
		    radius: 0,
		    fillKey: 'KOR',
		    latitude: 37.532308,
		    longitude: 126.957440
		  },{
		    name: 'Indonesia',
		    radius: 0,
		    fillKey: 'INA',
		    latitude: -6.211544,
		    longitude: 106.845172
		  }
		  ];


	countryname = data.country;
	
	
	countryliveliness.each(function(country){
		if(country.fillKey == data.country){
			country.radius = data.liveliness/300;
			coutryliveliness.push(country);
		}
	});
		
		
		
	console.log(countryliveliness);
	bubble_map.bubbles(countryliveliness);

/* 	console.log(data.country); */
/* 	console.log(data.liveliness); */
});

// ランキングを取得
io.on("ranking", function(data) {
/* 	console.log(data); */
});


// shake テスト
/*
io.push("shake", {
	geolocation: {latitude :0.0, longitude :0.0 },
	country : "GBR", 
	changevalue : 10
})
*/


// selectされた国をローカルストレージに保存
function changeSelect() {
	localStorage.countryCode = $('select[name="countryList"] option:selected').val();
}


// 位置情報の取得
if (navigator.geolocation) {
	var lat;
	var lon;
	
	function success(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		console.log(lat);
		console.log(lon);
	};
}
else {
	window.alert("このブラウザでは位置情報を取得できません");
}
function error() {
	window.alert("位置情報を取得できませんでした"); 
};
var options = {
	enableHighAccuracy: true, 
	timeout           : 20000
};
