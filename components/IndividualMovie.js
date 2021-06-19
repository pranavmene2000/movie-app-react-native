import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    StatusBar,
    Platform,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import HeaderImageScrollView, {
    TriggeringView,
} from 'react-native-image-header-scroll-view';

import * as Animatable from 'react-native-animatable';
import { FontAwesome } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getParsedDate, timeConvert, truncateContent } from '../utils/utils'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Thumbnail } from 'react-native-thumbnail-video';
import { AntDesign } from 'react-native-vector-icons'
const uuid = require('react-native-uuid');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 310;

const IndividualMovie = () => {
    const navTitleView = useRef(null);

    const route = useRoute()
    const navigation = useNavigation()

    const { MovieName, movieID } = route.params;

    const [movieData, setMovieData] = useState({});
    const [movieCastData, setmovieCastData] = useState([]);
    const [movieReviewData, setMovieReviewData] = useState([]);
    const [SimiliarMovieData, setSimiliarMovieData] = useState([]);
    const [movieVideos, setMovieVideos] = useState([]);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const abortController = new AbortController();

        async function makeRequests() {
            await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setMovieData(response)
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setmovieCastData(response.cast.filter(cast => cast.known_for_department === "Acting"))
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&page=1`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setSimiliarMovieData(response.results.slice(0, 10))
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/movie/${movieID}/reviews?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&page=1`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setMovieReviewData(response.results)
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setMovieVideos(response.results)
                })
                .catch(error => console.log(error))

            setLoading(false)
        }

        makeRequests()
        return () => {
            abortController.abort()
        }
    }, [movieID])

    const getURL = async (movieID) => {
        let movieURL;
        await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`)
            .then(response => response.json())
            .then(response => {
                movieURL = response.imdb_id
                // console.log(response.imdb_id)
            })
            .catch(error => console.log(error))

        return movieURL
    }

    // console.log(movieReviewData)

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <HeaderImageScrollView
                maxHeight={MAX_HEIGHT}
                minHeight={MIN_HEIGHT}
                maxOverlayOpacity={1}
                minOverlayOpacity={0.5}
                renderHeader={() => <Image resizeMode="cover" style={styles.image} source={{ uri: `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}` }} />}
                renderForeground={() => (
                    <View style={styles.titleContainer}>
                        {/* <Text style={styles.imageTitle}>{movieData.tagline ? `“${movieData.tagline}”` : null}</Text> */}
                        <Image
                            source={{ uri: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                            resizeMode="cover"
                            style={{
                                height: 200,
                                width: 130,
                                borderColor: 'white',
                                borderWidth: 2,
                            }}
                        />
                        <View style={{ alignSelf: 'center', marginLeft: 15 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', flexWrap: 'wrap', width: 200 }}>
                                {movieData.title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "700", color: 'white' }}>{movieData.vote_average}</Text>
                                    <Text style={{ marginLeft: 2, color: 'white' }}>/ 10</Text>
                                </View>
                                <FontAwesome style={{ marginLeft: 5, marginTop: 10 }} name="star" size={20} color="yellow" />
                            </View>
                        </View>
                    </View>
                )}
                renderFixedForeground={() => (
                    <Animatable.View style={styles.navTitleView} ref={navTitleView}>
                        <Text style={styles.navTitle}>{MovieName}</Text>
                    </Animatable.View>
                )}>
                <TriggeringView
                    style={movieData.tagline ? styles.section : null}
                    onHide={() => navTitleView.current.fadeInUp(200)}
                    onDisplay={() => navTitleView.current.fadeOut(100)}
                >
                    {movieData.tagline ? (
                        <View>
                            <Text style={styles.title}>{`“${movieData.tagline}”`}</Text>
                        </View>
                    ) : null}
                </TriggeringView>
                {
                    loading ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', marginTop: 15 }}>
                            <ActivityIndicator size="small" color="#0000ff" />
                        </View>
                    ) : (
                            <View style={styles.content} >
                                <Text style={{ marginBottom: 10, fontSize: 14, fontWeight: "700" }}>
                                    {movieData.genres?.map(genre => genre.name).join(", ")}
                                </Text>
                                {movieData.overview ? (
                                    <View style={styles.info}>
                                        <Text style={styles.overviewText} >{movieData.overview}</Text>
                                    </View>
                                ) : null}
                                <View style={{ marginTop: 25 }}>
                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>Release Date : </Text>
                                        <Text style={{ color: 'grey', fontSize: 15 }}>{movieData.release_date}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>Run Time : </Text>
                                        <Text style={{ color: 'grey', fontSize: 15 }}>{timeConvert(movieData.runtime)}</Text>
                                    </View>

                                    {movieVideos?.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }} >Videos</Text>
                                            <FlatList
                                                horizontal
                                                data={movieVideos}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={item => uuid.v1()}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <View style={{ marginRight: 10, elevation: 10, backgroundColor: '#ababab' }} >
                                                            <Thumbnail
                                                                imageWidth={windowWidth - 25}
                                                                containerStyle={{ borderRadius: 50 }}
                                                                iconStyle={{ borderRadius: 5 }}
                                                                url={`https://www.youtube.com/watch?v=${item.key}`}
                                                            />
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )}

                                    {movieCastData.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }} >Cast</Text>
                                            <FlatList
                                                horizontal
                                                data={movieCastData}
                                                showsHorizontalScrollIndicator={false}
                                                legacyImplementation={false}
                                                keyExtractor={item => uuid.v1()}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                navigation.push('CastInfo', {
                                                                    castName: item.name,
                                                                    castID: item.id,
                                                                })
                                                            }}
                                                        >
                                                            <View style={styles.castContainer} >
                                                                <Image
                                                                    resizeMode="cover"
                                                                    style={styles.castImage}
                                                                    source={{ uri: item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" }}
                                                                />
                                                                <Text style={{ marginTop: 5, color: "grey", flexWrap: "wrap" }}>{item.character.split("/")[0]}</Text>
                                                                <Text>{item.name}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )}

                                    {movieReviewData.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }} >Movie Reviews</Text>
                                            <FlatList
                                                horizontal
                                                data={movieReviewData}
                                                showsHorizontalScrollIndicator={false}
                                                legacyImplementation={false}
                                                keyExtractor={item => uuid.v1()}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <View style={styles.movieReviewContainer}>
                                                            <View style={styles.movieReviewsUp}>
                                                                <View style={styles.movieReviewsUpLeft}>
                                                                    <Image
                                                                        resizeMode="cover"
                                                                        style={styles.movieReviewsImage}
                                                                        source={{ uri: item.author_details.avatar_path !== null ? (item.author_details.avatar_path.includes("gravatar") ? item.author_details.avatar_path.slice(1) : `https://image.tmdb.org/t/p/w500${item.author_details.avatar_path}`) : "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" }}
                                                                    />
                                                                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                                                                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.author_details.name ? item.author_details.name : item.author}</Text>
                                                                        <Text style={{ fontSize: 15, color: 'grey' }}>{item.author_details.username}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.movieReviewsUpRight}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                                                        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                                                            <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.author_details.rating ? item.author_details.rating : `5.2`}</Text>
                                                                            <Text style={{ marginLeft: 2 }}>/ 10</Text>
                                                                        </View>
                                                                        <FontAwesome style={{ marginLeft: 5 }} name="star" size={20} color="#FF6347" />
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={styles.movieReviewsDown}>
                                                                <Text style={{ fontSize: 15, color: 'grey', margin: 10, textAlign: 'justify' }}>{truncateContent(item.content, 200)}</Text>
                                                                <Text style={{ textAlign: 'right', marginRight: 10 }}>{getParsedDate(item.created_at)}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )}

                                    {SimiliarMovieData.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }} >Smiliar Movies</Text>
                                            <FlatList
                                                horizontal
                                                data={SimiliarMovieData}
                                                showsHorizontalScrollIndicator={false}
                                                legacyImplementation={false}
                                                keyExtractor={item => uuid.v1()}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                navigation.push("MovieDetails", {
                                                                    MovieName: item.title,
                                                                    movieID: item.id,
                                                                    movieURL: getURL(item.id)
                                                                })
                                                            }}
                                                        >
                                                            <View style={styles.smiliarMovieContainer}>
                                                                <Image
                                                                    resizeMode="cover"
                                                                    style={styles.smiliarMovieImage}
                                                                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                                                                />
                                                                <View style={styles.down}>
                                                                    <Text style={{ fontSize: 13, textAlign: 'center' }}>{(item.title)}</Text>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <AntDesign style={{ marginLeft: 5, marginRight: 3 }} color={'#FF6347'} size={12} name="star" />
                                                                        <Text>{item.vote_average}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        )
                }
            </HeaderImageScrollView>
        </View>
    );
};

export default IndividualMovie;

const styles = StyleSheet.create({
    content: {
        margin: 12,
    },
    overviewText: {
        textAlign: 'justify',
        fontSize: 15,
        color: "gray"
    },

    castContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 15,
    },
    castImage: {
        flex: 1,
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#ababab'
    },

    //
    movieReviewContainer: {
        elevation: 2,
        width: windowWidth - 25,
        flexDirection: "column",
        padding: 10,
        backgroundColor: '#F6F6F6',
        borderRadius: 3,
        marginRight: 15
    },
    movieReviewsUp: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    movieReviewsUpLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    movieReviewsImage: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        overflow: "hidden",
        borderWidth: 3,
        backgroundColor: '#ababab'
    },



    smiliarMovieContainer: {
        width: windowWidth / 2.6,
        marginHorizontal: 5,
    },
    smiliarMovieImage: { 
        height: 230,
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#ababab'
    },
    down: {
        // flex: .5,
        marginHorizontal: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },



    container: {
        flex: 1,
    },
    image: {
        height: MAX_HEIGHT,
        width: Dimensions.get('window').width,
        alignSelf: 'stretch',
        resizeMode: 'cover',
    },
    title: {
        fontSize: 18,
        flexWrap: "wrap",
        fontWeight: 'bold',
    },
    name: {
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionContent: {
        fontSize: 16,
        textAlign: 'justify',
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    categoryContainer: {
        flexDirection: 'row',
        backgroundColor: '#FF6347',
        borderRadius: 20,
        margin: 10,
        padding: 10,
        paddingHorizontal: 15,
    },
    category: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
    },
    titleContainer: {
        flex: 1,
        // alignSelf: 'stretch',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginHorizontal: 20,
        marginBottom: 20
    },
    imageTitle: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 20,
        fontWeight: "bold"
    },
    navTitleView: {
        height: MIN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 40 : 3,
        opacity: 0,
    },
    navTitle: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    sectionLarge: {
        minHeight: 300,
    },

});