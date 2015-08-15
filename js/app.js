
// Sample code to better understand KO and GoogleMaps
//      http://jsfiddle.net/Wt3B8/23/

//global for map
var map;

$(document).ready(function () {
   
   createMap();
   ko.applyBindings(viewModel);
});

/* ======= Model ======= */

initialCats = [
    {
        clickCount : 0,
        name : 'Tabby',
        imgSrc : 'img/434164568_fea0ad4013_z.jpg',
        imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568',
        nicknames: ['Tabtab', 'T-Bone', 'Mr. T'],
        location: 'Atlanta, Ga'
    },
    {
        clickCount : 0,
        name : 'Tiger',
        imgSrc : 'img/4154543904_6e2428c421_z.jpg',
        imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904',
        nicknames: ['Tigger'],
        location: 'Denver, Co'
    },
    {
        clickCount : 0,
        name : 'Scaredy',
        imgSrc : 'img/22252709_010df3379e_z.jpg',
        imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709',
        nicknames: ['Fraidy'],
        location: 'Seattle, Wa'
    },
    {
        clickCount : 0,
        name : 'Shadow',
        imgSrc : 'img/1413379559_412a540d29_z.jpg',
        imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559',
        nicknames: ['Nighty'],
        location: 'Hershey, Pa'
    },
    {
        clickCount : 0,
        name : 'Sleepy',
        imgSrc : 'img/9648464288_2516b35537_z.jpg',
        imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288',
        nicknames: ['Zzzzz'],
        location: 'Orlando, Fl'
    }
];


var Cat = function(data) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttribution);
    this.nicknames = ko.observableArray(data.nicknames);

    this.title = ko.computed(function() {
        var title;
        var clicks = this.clickCount();
        if (clicks < 10) {
            title = 'Newborn';
        } else {
            title = 'other'; // I didn't code all the options
        }
        return title;
    }, this);
};

var ViewModel = function() {
    var self = this;
    self.Lat = ko.observable(12.24);
    self.Lng = ko.observable(24.54);

    this.catList = ko.observableArray([]);

    initialCats.forEach(function(catItem) {
        self.catList.push( new Cat(catItem) );
    });

    self.catList.sort(function(a,b) {
        // use a.name() because of the observables!
        return (a.name() > b.name()) ? 1 : 
            ((b.name() < a.name()) ? -1 : 0);
    });

    this.currentCat = ko.observable( self.catList()[0] );

    this.incrementCounter = function() {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };

    this.setCat = function(clickedCat) {
        self.currentCat(clickedCat);
    };
};

function createMap(){    
    var elevator;
    var myOptions = {
        zoom: 3,
        center: new google.maps.LatLng(12.24, 24.54),
        mapTypeId: 'terrain'
    };

    
    map = new google.maps.Map($('#map')[0], myOptions);
    
}

ko.bindingHandlers.map = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        // initializeMap();

        console.log("viewModel.Lat: ", viewModel.Lat());
        console.log("   bindings latitude", allBindingsAccessor() );

        var position = new google.maps.LatLng(
                allBindingsAccessor().latitude(), 
                allBindingsAccessor().longitude());

        var marker = new google.maps.Marker({
            map: allBindingsAccessor().map,
            position: position,
            title: name
        });

        viewModel._mapMarker = marker;

    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        // Do nothing for now.
        var latlng = new google.maps.LatLng(
                allBindingsAccessor().latitude(), 
                allBindingsAccessor().longitude());
            viewModel._mapMarker.setPosition(latlng);

        
    }

};


var viewModel = new ViewModel();
//ko.applyBindings(viewModel);
