import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../constants/colors';

function PlaceItem({place, onSelect}) {
  // Conditionally render the image or fallback text
  let imagePreview = place.item.imageuri ? (
    <Image style={styles.image} source={{uri: place.item.imageuri}} />
  ) : (
    <Text style={styles.fallbackText}>No Image Available</Text>
  );

  return (
    <Pressable
      style={({pressed}) => [styles.item, pressed && styles.pressed]}
      onPress={onSelect.bind(this, place.id)}>
      <View style={styles.imageContainer}>{imagePreview}</View>
      <View style={styles.info}>
        <Text style={styles.title}>{place.item.title}</Text>
        <Text style={styles.address}>{place.item.address}</Text>
      </View>
    </Pressable>
  );
}

export default PlaceItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  imageContainer: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    backgroundColor: Colors.primary100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  fallbackText: {
    color: Colors.gray700,
    fontSize: 12,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.gray700,
  },
  address: {
    fontSize: 12,
    color: Colors.gray700,
  },
});
