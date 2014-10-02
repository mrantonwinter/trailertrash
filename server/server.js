Meteor.startup(function () {
    // code to run on server at startup
    //MovieTrailers.remove({});
    RefreshMovieTrailers();

});



Meteor.publish('movietrailerdb', function () {
    return MovieTrailers.find({});
});




function RefreshMovieTrailers() {
    //var url = "http://api.themoviedb.org/3/movie/now_playing?";
    //var url = "http://api.themoviedb.org/3/movie/upcoming?";
    //var url = "http://api.themoviedb.org/3/movie/top_rated?";
    //var url = "http://api.themoviedb.org/3/movie/popular?";

    //var genre = 27; //horror
    var genre = '878|27|14|28'; //science-fiction

    for (var i = 1; i < 40; i++) {
        GetPage("http://api.themoviedb.org/3/discover/movie?sort_by=release_date.desc&with_genres=" + genre + "&language=en&vote_average.gte=1&vote_count.gte=5&", i);
        //GetPage("http://api.themoviedb.org/3/discover/movie?sort_by=release_date.desc&with_genres="+genre+"&language=en&", i); 
    }

}

function api_key() {
    return "api_key=622d361d96ff096f7184b7476bd541a8";
}

function GetPage(url, page) {


    Meteor.http.get(url + api_key() + "&page=" + page, function (error, result) {
        if (error) {
            debugger;
        }
        else {
            if (result.statusCode === 200) {
                AddResults(JSON.parse(result.content).results);
            }
        }
    });
}

function AddResults(rows) {
    _.each(rows, function (row) {
        if (row.poster_path) {

            GetTrailers(row)
        }
    });
}

function GetTrailers(row) {
    var url = 'http://api.themoviedb.org/3/movie/' + row.id + '/videos?' + api_key();

    Meteor.http.get(url, function (error, result) {
        if (error) {
            debugger;
        }
        else {
            if (result.statusCode === 200) {
                var results = JSON.parse(result.content).results;
                if (results.length > 0) {
                    if (MovieTrailers.find({ title: row.title }).fetch().length == 0) {
                        row['videoids'] = results;
                        MovieTrailers.insert(row);
                    }
                }
            }
        }
    });
}
