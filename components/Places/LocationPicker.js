import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  Image,
  Text,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker} from 'react-native-maps';
import OutlinedButton from '../UI/OutlinedButton';
import {Colors} from '../../constants/colors';
import {useEffect, useRef, useState} from 'react';
import {getMapPreview, getAddress} from '../../util/location';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';

function LocationPicker({onPickLocation}) {
  const mapRef = useRef();

  const [pickedLocation, setPickedLocation] = useState();
  const [region, setRegion] = useState({
    latitude: 24.859790637409915,
    longitude: 67.0655679702759,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0021,
  });
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();

  const changeLocation = () => {
  if (mapRef.current) {
    setTimeout(() => {
      mapRef.current.animateToRegion(
        {
          latitude: route.params.pickedlat,
          longitude: route.params.pickedlng,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0021,
        },
        2000
      );
    }, 500); // 500ms delay
  } else {
    console.log('Map reference is not set yet');
  }
};

  useEffect(() => {
    if (isFocused && route.params && route.params.pickedlat && route.params.pickedlng) {
      const mapPickedLocation = {
        lat: route.params.pickedlat,
        lng: route.params.pickedlng,
      };
      setPickedLocation(mapPickedLocation);
      setRegion(prevState => ({
        ...prevState,
        latitude: route.params.pickedlat,
        longitude: route.params.pickedlng,
      }));
      changeLocation();
    }
  }, [route, isFocused]);
  
  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng,
        );
        console.log(address, 'address')
        onPickLocation({...pickedLocation, address: address});
      }
    }

    handleLocation()
  }, [pickedLocation, onPickLocation]);

  async function getLocationHandler() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(info => {
            setPickedLocation({
              lat: info.coords.latitude,
              lng: info.coords.longitude,
            });
          });
          console.log('You can use the location');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  let locationPreview = <Text>No Location picked yet</Text>;

  if (pickedLocation) {
    locationPreview = (
      <MapView style={styles.map} initialRegion={region} ref={mapRef}>
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
      // <Image
      //   style={styles.image}
      //   source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}}
      // />
    );
  }

  function pickOnMapHandler() {
    navigation.navigate('Map');
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 300,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: 300,
  },
});
