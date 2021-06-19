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
import { getAge, getParsedDate, timeConvert, truncateContent } from '../utils/utils'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Thumbnail } from 'react-native-thumbnail-video';
import { AntDesign } from 'react-native-vector-icons'

const uuid = require('react-native-uuid');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 265;

const IndividualMovie = () => {
    const navTitleView = useRef(null);
    const route = useRoute()
    const navigation = useNavigation()

    const [CastInfo, setCastInfo] = useState({})
    const [CastMovies, setCastMovies] = useState([])
    const [CastTvShows, setCastTvShows] = useState([])
    const [loading, setLoading] = useState(true)

    const { castName, castID } = route.params

    useEffect(() => {
        const abortController = new AbortController();

        async function makeRequests() {
            await fetch(`https://api.themoviedb.org/3/person/${castID}?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => { setCastInfo(response) })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/person/${castID}/movie_credits?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => { setCastMovies(response.cast) })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/person/${castID}/tv_credits?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => { setCastTvShows(response.cast) })
                .catch(error => console.log(error))

            setLoading(false)
        }
        makeRequests();

        return () => {
            abortController.abort()
        }
    }, [castID])

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
                maxOverlayOpacity={0.6}
                minOverlayOpacity={0.3}
                renderHeader={() => <View style={styles.image} ></View>}
                renderForeground={() => (
                    <View style={styles.titleContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                            <View >
                                <Image
                                    source={{ uri: CastInfo.profile_path ? `https://image.tmdb.org/t/p/w500/${CastInfo.profile_path}` : "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" }}
                                    resizeMode="cover"
                                    style={{ width: 140, height: 140, borderRadius: 140 / 2 }}
                                />
                            </View>
                            <View style={{ flexDirection: "column", marginLeft: 20 }}>
                                <Text style={{ color: 'white', fontSize: 23, fontWeight: '900', width: 175 }}>{CastInfo.name}</Text>

                                <Text style={{ color: 'white', marginTop: 7, fontSize: 17, fontWeight: "800" }}>Age</Text>
                                <Text style={{ color: 'white', marginTop: 4 }}>{CastInfo.birthday ? getAge(CastInfo.birthday) : "-"}</Text>

                                <Text style={{ color: 'white', marginTop: 7, fontSize: 17, fontWeight: "800" }}>Birth place</Text>
                                <Text style={{ color: 'white', marginTop: 4, width: 175 }}>{(CastInfo.place_of_birth ? CastInfo.place_of_birth : "-")}</Text>
                            </View>
                        </View>
                    </View>
                )}
                renderFixedForeground={() => (
                    <Animatable.View style={styles.navTitleView} ref={navTitleView}>
                        <Text style={styles.navTitle}>{castName}</Text>
                    </Animatable.View>
                )}>
                <TriggeringView
                    style={styles.section}
                    onHide={() => navTitleView.current.fadeInUp(200)}
                    onDisplay={() => navTitleView.current.fadeOut(100)}
                >
                    {CastInfo.biography ? <Text style={{ fontSize: 20, fontWeight: '700' }}>Biography</Text> : null}
                </TriggeringView>

                {loading ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                ) : (
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={{ color: 'grey',marginLeft : 5 }}>
                                {CastInfo.biography}
                            </Text>

                            {CastMovies.length === 0 ? (
                                null
                            ) : (
                                    <View style={{ marginTop: 15 }}>
                                        <Text style={{ fontSize: 20, marginBottom: 10, marginLeft: 5 }}>Cast Movies</Text>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            data={CastMovies}
                                            keyExtractor={(item, index) => uuid.v1()}
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
                                                        <View style={{ width: windowWidth / 2.6, marginHorizontal: 5 }}>
                                                            <Image
                                                                source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                                                                resizeMode="cover"
                                                                style={{
                                                                    height: 230, flex: 1, borderRadius: 5,
                                                                    backgroundColor: '#ababab'
                                                                }}
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

                            {CastTvShows.length === 0 ? (
                                null
                            ) : (
                                    <View style={{ marginTop: 15,marginBottom : 5 }}>
                                        <Text style={{ fontSize: 20, marginBottom: 10, marginLeft: 5 }}>Cast Tv Shows</Text>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            data={CastTvShows}
                                            keyExtractor={(item) => uuid.v1()}
                                            renderItem={({ item }) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            navigation.push("TvDetails", {
                                                                TvShowName: item.original_name,
                                                                tvshowID: item.id
                                                            })
                                                        }}
                                                    >
                                                        <View style={{ width: windowWidth / 2.6, marginHorizontal: 5 }}>
                                                            <Image
                                                                source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                                                                resizeMode="cover"
                                                                style={{
                                                                    height: 230, flex: 1, borderRadius: 5,
                                                                    backgroundColor: '#ababab'
                                                                }}
                                                            />
                                                            <View style={styles.down}>
                                                                <Text style={{ fontSize: 13, textAlign: 'center' }}>{(item.name)}</Text>
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
                    )}
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
        width: 140,
        height: 140,
        borderRadius: 50,
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
    },



    smiliarMovieContainer: {
        height: 285,
        width: windowWidth / 2.21,
        marginHorizontal: 5
    },
    smiliarMovieImage: {
        flex: 1,
        borderRadius: 5,
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
        backgroundColor: '#032541'
    },
    title: {
        fontSize: 20,
        flexWrap: "wrap",
        fontWeight: 'bold',
        width: 270
    },
    name: {
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
    imageTitle: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 22,
        fontWeight: "bold"
    },
    navTitleView: {
        height: MIN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 40 : 5,
        opacity: 0,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    sectionLarge: {
        minHeight: 300,
    },
});