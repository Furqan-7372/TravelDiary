import {openDatabase, enablePromise } from 'react-native-sqlite-storage';
import {Place} from '../models/place';
import { resolver } from '../metro.config';

const database = openDatabase('places.db');

enablePromise(true)

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS places (
                  id INTEGER PRIMARY KEY NOT NULL,
                  title TEXT NOT NULL,
                  imageuri TEXT NOT NULL,
                  address TEXT NOT NULL,
                  lat REAL NOT NULL,
                  long REAL NOT NULL
                  )`,
        [],
        () => {
          resolve('Success');
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });

  return promise;
}

export function insertPlace(place) {
  const promise = new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `INSERT INTO places (title, imageuri, address, lat, long) VALUES (?, ?, ?, ?, ?)`,
        [
          place.title,
          place.imageUri, // Ensure this is the correct key for the image URI
          place.address,
          place.location.lat,
          place.location.lng,
        ],
        (_, result) => {
          console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });

  return promise;
}

export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM places`,
          [],
          (_, result) => {
            // Extract rows from the result object
            const places = [];
            for (let i = 0; i < result.rows.length; i++) {
              places.push(result.rows.item(i)); // Push each row into the places array
            }
            console.log(places); // Log the retrieved places to see the data
            resolve(places);
          },
          (_, error) => {
            reject(error);
          },
        );
      });
    });
  
    return promise;
  }
  
  export function fetchPlaceDetails(id) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM places WHERE id = ?',
          [id],
          (_, result) => {
            resolve(result.rows._array[0])
          },
          (_, error) => {
            reject(error);
          }
        )
      })
    })
    return promise
  }