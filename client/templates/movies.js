Template.movies.movietrailers = function () {
    return TrailerList();
}


Template.movies.currenttrailer = function () {
    return TrailerList()[Session.get('index')];
}

Template.movies.count = function () {
    return MovieTrailers.find().fetch().length;
}

Template.movies.ready = function () {
    return Template.movies.currenttrailer() != null;
}

Template.movies.rendered = function () {
    if (!Session.get('playing'))
        PlayCurrentTrailer();
}


Meteor.subscribe('movietrailerdb', function () {
    if (!Session.get('playing'))
        PlayCurrentTrailer();
});


//var el = document.getElementById('player');
//if (el.requestFullScreen) {
//    el.requestFullScreen();
//} else if (el.mozRequestFullScreen) {
//    el.mozRequestFullScreen();
//} else if (el.webkitRequestFullScreen) {
//    el.webkitRequestFullScreen();
//}

Template.movies.events({
    'click #next': function () { PlayNextTrailer(); },
    'click #prev': function () { PlayPreviousTrailer(); }
});



function PlayNextTrailer() {
    player.stopVideo();
    var index = Session.get('index') + 1;
    if (index >= Template.movies.count())
        index = 0;

    Session.set('index', index);
    PlayCurrentTrailer()
}

function PlayPreviousTrailer() {
    player.stopVideo();
    var index = Session.get('index') - 1;
    if (index < 0)
        index = Template.movies.count() - 1;
    Session.set('index', index);
    PlayCurrentTrailer()

}

function PlayCurrentTrailer() {
    if (Template.movies.ready() && player && typeof player != 'undefined' && player.loadVideoById) {
        var trailer = Template.movies.currenttrailer();
        var videoid = trailer.videoids[0].key;
        player.loadVideoById({ videoId: videoid });
        Session.set('playing', true);
    }
}

Meteor.methods({
    nextmovietrailer: function () { PlayNextTrailer(); return -1; },
    currentmovietrailer: function () { PlayCurrentTrailer(); return -1; },
})


function TrailerList() {
    return MovieTrailers.find({}, { sort: { release_date: -1, popularity: -1 } }).fetch();
}

