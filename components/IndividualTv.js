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

import uuid from 'react-native-uuid'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 310;

const IndividualMovie = () => {
    const navTitleView = useRef(null);

    const route = useRoute()
    const navigation = useNavigation()

    const { TvShowName, tvshowID } = route.params;

    const [tvShowData, setTvShowData] = useState({});
    const [TvCastData, setTvCastData] = useState([]);
    const [tvShowReviewsData, settvShowReviewsData] = useState([]);
    const [SimiliarTvData, setSimiliarTvData] = useState([]);
    const [TvShowVideos, setTvShowVideos] = useState([]);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const abortController = new AbortController();

        async function makeRequets() {
            await fetch(`https://api.themoviedb.org/3/tv/${tvshowID}?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setTvShowData(response)
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/tv/${tvshowID}/credits?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setTvCastData(response.cast.filter(cast => cast.known_for_department === "Acting"))
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/tv/${tvshowID}/similar?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&page=1`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setSimiliarTvData(response.results.slice(0, 10))
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/tv/${tvshowID}/reviews?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&page=1`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    settvShowReviewsData(response.results)
                })
                .catch(error => console.log(error))

            await fetch(`https://api.themoviedb.org/3/tv/${tvshowID}/videos?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US`,
                { signal: abortController.signal })
                .then(response => response.json())
                .then(response => {
                    setTvShowVideos(response.results)
                })
                .catch(error => console.log(error))

            setLoading(false)
        }

        makeRequets()
        return () => {
            abortController.abort()
        }
    }, [tvshowID])

    // console.log(movieCastData)


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <HeaderImageScrollView
                maxHeight={MAX_HEIGHT}
                minHeight={MIN_HEIGHT}
                maxOverlayOpacity={1}
                minOverlayOpacity={0.5}
                renderHeader={() => <Image resizeMode="cover" style={styles.image} source={{ uri: `https://image.tmdb.org/t/p/w500${tvShowData.backdrop_path}` }} />}
                renderForeground={() => (
                    <View style={styles.titleContainer}>
                        {/* <Text style={styles.imageTitle}>{tvShowData.tagline ? `“${tvShowData.tagline}”` : null}</Text> */}
                        <Image
                            source={{ uri: tvShowData.poster_path ? `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                            resizeMode="cover"
                            style={{
                                height: 200,
                                width: 130,
                                borderColor: 'white',
                                borderWidth: 2,
                            }}
                        />
                        <View style={{ alignSelf: 'center', marginHorizontal: 10 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', flexWrap: 'wrap', width: 200 }}>
                                {tvShowData.title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "700", color: 'white' }}>{tvShowData.vote_average}</Text>
                                    <Text style={{ marginLeft: 2, color: 'white' }}>/ 10</Text>
                                </View>
                                <FontAwesome style={{ marginLeft: 5, marginTop: 10 }} name="star" size={20} color="yellow" />
                            </View>
                        </View>
                    </View>
                )}
                renderFixedForeground={() => (
                    <Animatable.View style={styles.navTitleView} ref={navTitleView}>
                        <Text style={styles.navTitle}>{TvShowName}</Text>
                    </Animatable.View>
                )}>
                <TriggeringView
                    style={tvShowData.tagline ? styles.section : null}
                    onHide={() => navTitleView.current.fadeInUp(200)}
                    onDisplay={() => navTitleView.current.fadeOut(100)}
                >
                    {tvShowData.tagline ? (
                        <View>
                            <Text style={styles.title}>{`“${tvShowData.tagline}”`}</Text>
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
                                    {tvShowData.genres?.map(genre => genre.name).join(", ")}
                                </Text>
                                {tvShowData.overview ? (
                                    <View style={styles.info}>
                                        <Text style={styles.overviewText} >{tvShowData.overview}</Text>
                                    </View>
                                ) : null}
                                <View style={{ marginTop: 15 }}>
                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>Status : </Text>
                                        <Text style={{ color: 'grey', fontSize: 15 }}>{tvShowData.status}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>Type : </Text>
                                        <Text style={{ color: 'grey', fontSize: 15 }}>{tvShowData.type}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>First Air Date : </Text>
                                        <Text style={{ color: 'grey', fontSize: 15 }}>{tvShowData.first_air_date}</Text>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15 }}>Number Of Episodes : </Text>
                                            <Text style={{ color: 'grey', fontSize: 15 }}>{tvShowData.number_of_episodes}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15 }}>Number Of Seasons : </Text>
                                            <Text style={{ color: 'grey', fontSize: 15 }}>{tvShowData.number_of_seasons}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15 }}>Origin Country : </Text>
                                            <Text style={{ color: 'grey', fontSize: 15 }}>{tvShowData.origin_country[0]}</Text>
                                        </View>
                                    </View>


                                    {TvShowVideos.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, marginBottom: 10 }} >Videos</Text>
                                            <FlatList
                                                horizontal
                                                data={TvShowVideos}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={item => uuid.v1()}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <View style={{
                                                            marginRight: 10, elevation: 10,
                                                            backgroundColor: '#ababab'
                                                        }} >
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

                                    {TvCastData.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, marginBottom: 10 }} >Cast</Text>
                                            <FlatList
                                                horizontal
                                                data={TvCastData}
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
                                                                <Text>{item.original_name}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )}

                                    {tvShowReviewsData.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, marginBottom: 10 }} >Tv Show Reviews</Text>
                                            <FlatList
                                                horizontal
                                                data={tvShowReviewsData}
                                                showsHorizontalScrollIndicator={false}
                                                legacyImplementation={false}
                                                keyExtractor={item => uuid.v1()}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <View style={styles.tvShowReviewContainer}>
                                                            <View style={styles.tvShowReviewsUp}>
                                                                <View style={styles.tvShowReviewsUpLeft}>
                                                                    <Image
                                                                        resizeMode="cover"
                                                                        style={styles.tvShowReviewsImage}
                                                                        source={{ uri: item.author_details.avatar_path !== null ? (item.author_details.avatar_path.includes("gravatar") ? item.author_details.avatar_path.slice(1) : `https://image.tmdb.org/t/p/w500${item.author_details.avatar_path}`) : "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" }}
                                                                    />
                                                                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                                                                        <Text style={{ fontSize: 15 }}>{item.author_details.name ? item.author_details.name : item.author}</Text>
                                                                        <Text style={{ fontSize: 15, color: 'grey' }}>{item.author_details.username}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.tvShowReviewsUpRight}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                                                        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                                                            <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.author_details.rating ? item.author_details.rating : `5.2`}</Text>
                                                                            <Text style={{ marginLeft: 2 }}>/ 10</Text>
                                                                        </View>
                                                                        <FontAwesome style={{ marginLeft: 5 }} name="star" size={20} color="#FF6347" />
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={styles.tvShowReviewsDown}>
                                                                <Text style={{ fontSize: 15, color: 'grey', margin: 10, textAlign: 'justify' }}>{truncateContent(item.content, 200)}</Text>
                                                                <Text style={{ textAlign: 'right', marginRight: 10 }}>{getParsedDate(item.created_at)}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </View>
                                    )}

                                    {SimiliarTvData.length === 0 ? null : (
                                        <View style={{ marginTop: 25 }}>
                                            <Text style={{ fontSize: 20, marginBottom: 10 }} >Smiliar Tv Shows</Text>
                                            <FlatList
                                                horizontal
                                                data={SimiliarTvData}
                                                showsHorizontalScrollIndicator={false}
                                                legacyImplementation={false}
                                                keyExtractor={item => uuid.v1()}
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
                                                            <View style={styles.smiliarTvShowsContainer}>
                                                                <Image
                                                                    resizeMode="cover"
                                                                    style={styles.smiliarTvShowsImage}
                                                                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
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



    tvShowReviewContainer: {
        elevation: 2,
        width: windowWidth - 25,
        flexDirection: "column",
        padding: 10,
        backgroundColor: '#F6F6F6',
        borderRadius: 3,
        marginRight: 15
    },
    tvShowReviewsUp: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tvShowReviewsUpLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    tvShowReviewsImage: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        overflow: "hidden",
        borderWidth: 3,
        backgroundColor: '#ababab'
    },


    smiliarTvShowsContainer: {
        width: windowWidth / 2.6,
        marginHorizontal: 5,
    },
    smiliarTvShowsImage: {
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