import React from 'react'

import { Buffer } from 'buffer';
global.Buffer = Buffer; // very important

import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from 'react-native-vector-icons';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import ViewAllMovies from './components/ViewAllMovies';
import ViewAllTv from './components/ViewAllTv';
import IndividualMovie from './components/IndividualMovie';
import IndividualTv from './components/IndividualTv';
import CastInfo from './components/CastInfo';
import Search from './components/Search';
import { Button, Share, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createBottomTabNavigator();
function HomeStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Movies') {
            iconName = focused
              ? 'movie-open'
              : 'movie-open-outline';
          } else if (route.name === 'Tv Shows') {
            iconName = focused ? 'live-tv' : 'live-tv';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          }

          return (
            route.name === 'Movies' ? (
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
            ) : (
                <MaterialIcons name={iconName} size={size} color={color} />
              )
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Movies"
        component={Movies}
      />
      <Tab.Screen
        name="Tv Shows"
        component={TvShows}
      />
      <Tab.Screen
        name="Search"
        component={Search}
      />
    </Tab.Navigator>
  );
}


const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      {/* initialRouteName="Splash" */}
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeStack}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerShown: getHeader(route),
            headerLeft: null
          })}
        />
        <Stack.Screen
          name="ViewAllMovies"
          component={ViewAllMovies}
          options={({ route }) => ({ title: route.params.name, ...TransitionPresets.SlideFromRightIOS, })}
        />
        <Stack.Screen
          name="ViewAllTv"
          component={ViewAllTv}
          options={({ route }) => ({ title: route.params.name, ...TransitionPresets.SlideFromRightIOS, })}
        />
        <Stack.Screen
          name="MovieDetails"
          component={IndividualMovie}
          options={({ route }) => ({
            // title: route.params.MovieName,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => onShareForMovie(route)}
              >
                <Ionicons name="ios-share-social" color="white" size={25} style={{ marginRight: 15 }} />
              </TouchableOpacity>
            ),
            ...TransitionPresets.SlideFromRightIOS,
            headerBackTitleVisible: false,
            headerTitle: false,
            headerTransparent: true,
            headerTintColor: '#fff'
          })}
        />
        <Stack.Screen
          name="TvDetails"
          component={IndividualTv}
          options={({ route }) => ({
            // title: route.params.TvShowName,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => onShareForTvShow(route)}
              >
                <Ionicons name="ios-share-social" color="white" size={25} style={{ marginRight: 15 }} />
              </TouchableOpacity>
            ),
            ...TransitionPresets.SlideFromRightIOS,
            headerBackTitleVisible: false,
            headerTitle: false,
            headerTransparent: true,
            headerTintColor: '#fff'
          })}
        />
        <Stack.Screen
          name="CastInfo"
          component={CastInfo}
          options={({ route }) => ({
            // title: route.params.name,
            ...TransitionPresets.SlideFromRightIOS,
            headerBackTitleVisible: false,
            headerTitle: false,
            headerTransparent: true,
            headerTintColor: '#fff'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;

//Additional Functions
function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Movies'

  switch (routeName) {
    case 'Movies':
      return 'Movies';
    case 'Tv Shows':
      return 'Tv Shows';
    case 'Search':
      return 'Search'
  }
}


function getHeader(route) {
  const routeName = getFocusedRouteNameFromRoute(route);

  switch (routeName) {
    case 'Movies':
      return true;
    case 'Tv Shows':
      return true;
    case 'Search':
      return true;
  }
}

const onShareForMovie = (route) => {
  const url = route.params.movieURL["_W"]
  Share.share({
    message: `https://www.imdb.com/title/${url}`,
  });
};

const onShareForTvShow = (route) => {
  const url = route.params.TvShowName.toLowerCase().split(" ").join("-");
  Share.share({
    message: `http://www.tv.com/shows/${url}`,
  });
};

