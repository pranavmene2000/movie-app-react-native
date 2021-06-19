import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from 'react-native-vector-icons'
import uuid from 'react-native-uuid'
import { shortTitle, shortOverView, shortName } from './../utils/utils'

import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TvShowsRow({ tvShows, type, small }) {

    const navigation = useNavigation();

    return (
        <View style={styles.TvShowsRow}>
            <View>
                <View style={styles.titleForEach}>
                    <Text style={styles.type}>{type}</Text>
                    <Text onPress={() => { navigation.navigate('ViewAllTv', { name: type }) }} style={styles.viewMore}>View More</Text>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    legacyImplementation={false}
                    data={tvShows}
                    keyExtractor={(item) => uuid.v1()}
                    renderItem={({ item }) => {
                        return (
                            item.backdrop_path ? (
                                <TouchableOpacity
                                    activeOpacity={.1}
                                    onPress={() => {
                                        navigation.navigate('TvDetails', {
                                            TvShowName: item.original_name,
                                            tvshowID: item.id
                                        })
                                    }}
                                >
                                    <View style={[(small) ? styles.smallContainer : styles.container]}>
                                        <View style={styles.up}>
                                            <Image
                                                style={styles.image}
                                                resizeMode={`${small ? "cover" : "cover"}`}
                                                source={{
                                                    uri: `https://image.tmdb.org/t/p/w500${(small) ? item.poster_path : item.backdrop_path}`
                                                }}
                                            />
                                            <View style={styles.imageBottom}>
                                                <Text style={styles.textTitle}>{(small) ? null : shortTitle(item?.original_name)}</Text>
                                                <View style={styles.star}>
                                                    <Text style={styles.textStar}>{(small) ? null : item.vote_average}</Text>
                                                    {!small ? <AntDesign style={{ marginLeft: 5 }} color={'yellow'} size={15} name="star" /> : null}
                                                </View>
                                            </View>
                                        </View>
                                        {!small ? null : (
                                            <View style={styles.down}>
                                                <Text style={{ fontSize: 13, textAlign: 'center' }}>{(item.name)}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <AntDesign style={{ marginLeft: 5, marginRight: 3 }} color={'#FF6347'} size={12} name="star" />
                                                    <Text>{item.vote_average}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                    null
                                )
                        )
                    }}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    TvShowsRow: {
        marginTop: 12
    },
    movieRowContainer: {
        flexDirection: 'row'
    },
    type: {
        fontSize: 20,
        marginLeft: 10,
        // fontWeight: 'bold'
    },
    viewMore: {
        marginRight: 15,
        fontSize: 14
    },
    titleForEach: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    container: {
        height: 230,
        width: windowWidth - 10,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        borderRadius: 5,
        // borderColor : 'grey',
        // elevation: 0.1,
        flexDirection: 'column',
    },
    smallContainer: {
        width: windowWidth / 2.6,
        // height: 230,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        borderRadius: 5,
        // borderColor : 'grey',
        // elevation: 0.1,
        flexDirection: 'column',
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 5,
        height: 225,
        backgroundColor : '#ababab'
    },
    imageBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    smallImageBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 10
    },
    star: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textTitle: {
        color: 'white',
        fontSize: 21,
        fontWeight: "800",
    },
    smallTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "800",
    },
    textStar: {
        color: 'white',
        fontSize: 20,
        fontWeight: "900",
    },
    smallTextStar: {
        color: 'white',
        fontSize: 14,
        fontWeight: "900",
    },
    up: {
        flex: 2,
    },
    down: {
        // flex: .5,
        marginHorizontal: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
})