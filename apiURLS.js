//movies

export const nowPlaying = "https://api.themoviedb.org/3/movie/now_playing?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"
export const popularM = "https://api.themoviedb.org/3/movie/popular?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"
export const topRatedM = "https://api.themoviedb.org/3/movie/top_rated?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"
export const upcommingM = "https://api.themoviedb.org/3/movie/upcoming?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"

export const selectViewForMovie = {
    "Now Playing": nowPlaying,
    "Popular": popularM,
    "Top Rated": topRatedM,
    "Upcomming": upcommingM
}



//tvshows

export const airingToday = "https://api.themoviedb.org/3/tv/airing_today?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"
export const popularTV = "https://api.themoviedb.org/3/tv/popular?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"
export const topRatedTV = "https://api.themoviedb.org/3/tv/top_rated?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"
export const upcommingTV = "https://api.themoviedb.org/3/tv/on_the_air?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&"


export const selectViewForTv = {
    "Airing Today": airingToday,
    "Popular": popularTV,
    "Top Rated": topRatedTV,
    "Upcomming": upcommingTV
}