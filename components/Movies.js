import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native'
import MoviesRow from './MoviesRow'
import { nowPlaying, topRatedM, upcommingM, popularM } from './../apiURLS'
import { ScrollView } from 'react-native-gesture-handler'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
 
export default function Movies() {

    const [NowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [PopularMovies, setPopularMovies] = useState([]);
    const [TopratedMovies, setTopratedMovies] = useState([]);
    const [upcommingMovies, setupcommingMovies] = useState([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();

        async function makeRequests() {
            setLoading(true)

            await fetch(nowPlaying, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setNowPlayingMovies(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            await fetch(popularM, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setPopularMovies(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            await fetch(topRatedM, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setTopratedMovies(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            await fetch(upcommingM, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setupcommingMovies(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            setLoading(false)
        }

        makeRequests();
        return () => {
            abortController.abort()
        }
    }, [nowPlaying, popularM, topRatedM, upcommingM])

    return (
        <View>
            <ScrollView>
                {!loading ? (
                    <View style={styles.container}>
                        <MoviesRow type="Now Playing" Movies={NowPlayingMovies} />
                        <MoviesRow small type="Popular" Movies={PopularMovies} />
                        <MoviesRow small type="Top Rated" Movies={TopratedMovies} />
                        <MoviesRow small type="Upcomming" Movies={upcommingMovies} />
                    </View>
                ) : (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: windowHeight / 2.6
                        }}
                        >
                            <ActivityIndicator
                                color="#0000ff"
                                size="large"
                                style={styles.activityIndicator} />
                        </View>
                    )}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    }
})