import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, Dimensions, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
const uuid = require('react-native-uuid');

import { Entypo } from 'react-native-vector-icons'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Search() {

    const navigation = useNavigation()

    const [search, setSearch] = useState('')
    const [People, setPeople] = useState([])
    const [Movies, setMovies] = useState([])
    const [tvShows, settvShows] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function handleSearch() {
        setPeople([])
        setMovies([])
        settvShows([])
        if (search !== '') {
            setLoading(true)
            await fetch(`https://api.themoviedb.org/3/search/person?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&query=${search}&page=1&include_adult=false`)
                .then((response) => response.json())
                .then(response => { setPeople(response.results) })
                .catch((error) => console.log(error))

            await fetch(`https://api.themoviedb.org/3/search/movie?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&query=${search}&page=1&include_adult=false`)
                .then((response) => response.json())
                .then(response => { setMovies(response.results) })
                .catch((error) => console.log(error))

            await fetch(`https://api.themoviedb.org/3/search/tv?api_key=00f99db61c668c11e85cd85d7ae7c2ab&language=en-US&query=${search}&page=1&include_adult=false`)
                .then((response) => response.json())
                .then(response => { settvShows(response.results) })
                .catch((error) => console.log(error))

            setLoading(false);
        }
    }

    const renderSeparator = () => (
        <View style={{ height: 100, backgroundColor: 'grey', marginLeft: 10 }} />
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>
                <View
                    style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 10,
                        marginBottom: 10,
                        borderColor: 'gray',
                        borderRadius: 5,
                        borderWidth: .6,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: 'white'
                    }}
                >
                    <TextInput
                        onSubmitEditing={handleSearch}
                        onChange={(e) => setSearch(e.nativeEvent.text)}
                        style={styles.searchBar}
                        placeholder="Search here..."
                        clearButtonMode='always'
                        returnKeyType="search"
                        value={search}
                    />
                    <TouchableOpacity
                        style={styles.closeButtonParent}
                        onPress={() => setSearch('')}>
                        <Image
                            style={styles.closeButton}
                            source={{ uri: `https://cdn.onlinewebfonts.com/svg/img_469207.png` }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* {error ? (
                Alert.alert(
                    "Error",
                    "Enter valid query",
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
            ) : null} */}

            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', height: '100%' }}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            ) : (
                    <ScrollView>
                        <View style={{ marginTop: 10, marginHorizontal: 10 }}>
                            {People?.length === 0 ? null : <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 10 }} >People</Text>}
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={renderSeparator}
                                data={People}
                                keyExtractor={(item) => uuid.v1()}
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
                                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Image
                                                    source={{ uri: item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" }}
                                                    resizeMode="cover"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 80 / 2,
                                                        overflow: "hidden",
                                                        borderWidth: 3,
                                                        backgroundColor: '#ababab'
                                                    }}
                                                />
                                                <Text style={{ textAlign: 'center', fontSize: 13, marginTop: 4, marginHorizontal: 5 }}>{item.name}</Text>
                                                <Text style={{ textAlign: 'center', color: 'grey', marginTop: 4 }}>
                                                    {item.known_for_department}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>

                        <View style={{ marginTop: 15, marginHorizontal: 10 }}>
                            {Movies?.length == 0 ? null : <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 10 }} >Movies</Text>}
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={renderSeparator}
                                data={Movies}
                                keyExtractor={(item) => uuid.v1()}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.push("MovieDetails", {
                                                    MovieName: item.title,
                                                    movieID: item.id
                                                })
                                            }}
                                        >
                                            <View style={styles.movieContainer}>
                                                <Image
                                                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                                                    resizeMode="cover"
                                                    style={{
                                                        flex: 1,
                                                        borderRadius: 5,
                                                        height: 230,
                                                        backgroundColor: '#ababab'
                                                    }}
                                                />
                                                <Text style={{ textAlign: 'center', fontSize: 13, marginTop: 4, marginHorizontal: 5 }}>{item.title}</Text>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 4 }}>
                                                    <Entypo color="#FF6347" name="star" size={18} style={{ marginRight: 5 }} /> {item.vote_average}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>

                        <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                            {tvShows?.length === 0 ? null : <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 10 }} >Tv Shows</Text>}
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={renderSeparator}
                                data={tvShows}
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
                                            <View style={styles.movieContainer}>
                                                <Image
                                                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ" }}
                                                    resizeMode="cover"
                                                    style={{
                                                        flex: 1,
                                                        borderRadius: 5,
                                                        height: 230,
                                                        backgroundColor: '#ababab'
                                                    }}
                                                />
                                                <Text style={{ textAlign: 'center', fontSize: 13, marginTop: 4, marginHorizontal: 5 }}>{item.name}</Text>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 4 }}>
                                                    <Entypo color="#FF6347" name="star" size={18} style={{ marginRight: 5 }} /> {item.vote_average}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </ScrollView>
                )}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'black',
        height: '100%',
    },
    searchBar: {
        paddingHorizontal: 15,
        height: 40,
        width: '90%',
        color : 'black'
    },
    closeButton: {
        height: 18,
        width: 18,
    },
    movieContainer: {
        width: windowWidth / 2.6
    },

    closeButtonParent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
})
