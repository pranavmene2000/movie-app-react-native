import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { selectViewForTv } from '../apiURLS'
import { AntDesign } from 'react-native-vector-icons'
import uuid from 'react-native-uuid'
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ViewAll() {
    const route = useRoute()
    const [view, setView] = useState([])
    const [page, setPage] = useState(1)

    const navigation = useNavigation()

    const abortController = new AbortController();
    useEffect(() => {
        makeRequest()
        return () => {
            abortController.abort()
        }
    }, [route.params.name, makeRequest, page])

    const makeRequest = async () => {
        await fetch(selectViewForTv[route.params.name] + `page=${page}`, { signal: abortController.signal }).then(response => response.json())
            .then(response => {
                // console.log(response)
                setView([...view, ...response.results])
            })
            .catch(error => console.log(error))
    }

    const fetchMore = () => {
        setPage((prevState) => prevState + 1);
    }

    return (
        <View style={styles.view}>
            <SafeAreaView>
                <FlatList
                    data={view}
                    keyExtractor={(item) => uuid.v1()}
                    numColumns={3}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={.1}
                                onPress={() => {
                                    navigation.navigate('TvDetails', {
                                        TvShowName: item.original_name,
                                        tvshowID: item.id
                                    })
                                }}
                            >
                                <View style={styles.container}>
                                    <Image
                                        source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : `https://resizing.flixster.com/rbrf9qrOdUb_g9TX6Nd0htC0m48=/206x305/v1.bTsxMjY1NzcxNDtnOzE4Njg2OzEyMDA7MjA2OzMwNQ` }}
                                        resizeMode="cover"
                                        style={styles.image}
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
                    onEndReached={fetchMore}
                    onEndReachedThreshold={0.1}
                />
            </SafeAreaView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: windowWidth / 3.15,
        marginHorizontal: 3,
        marginTop : 6
    },
    image: {
        height: 230,
        flex: 1,
        borderRadius: 3,
        backgroundColor: '#ababab'
    },
    down: {
        // flex: .5,
        marginHorizontal: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
})