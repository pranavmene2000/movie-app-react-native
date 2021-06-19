import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native'
import TvShowsRow from './TvShowsRow'
import { airingToday, popularTV, topRatedTV, upcommingTV } from './../apiURLS'
import { ScrollView } from 'react-native-gesture-handler'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TvShows() {

    const [NowPlayingTv, setNowPlayingTv] = useState([]);
    const [PopularTv, setPopularTv] = useState([]);
    const [TopratedTv, setTopratedTv] = useState([]);
    const [upcommingTv, setupcommingTv] = useState([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();

        async function makeRequests() {
            setLoading(true)

            await fetch(airingToday, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setNowPlayingTv(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            await fetch(popularTV, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setPopularTv(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            await fetch(topRatedTV, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setTopratedTv(response.results.slice(0, 10))
                })
                .catch(error => {
                    console.log(error)
                })

            await fetch(upcommingTV, { signal: abortController.signal }).then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setupcommingTv(response.results.slice(0, 10))
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
    }, [airingToday, popularTV, topRatedTV, upcommingTV])

    return (
        <View>
            <ScrollView>
                {!loading ? (
                    <View style={styles.container}>
                        <TvShowsRow type="Airing Today" tvShows={NowPlayingTv} />
                        <TvShowsRow small type="Popular" tvShows={PopularTv} />
                        <TvShowsRow small type="Top Rated" tvShows={TopratedTv} />
                        <TvShowsRow small type="Upcomming" tvShows={upcommingTv} />
                    </View>
                ) : (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: windowHeight / 2.6,
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