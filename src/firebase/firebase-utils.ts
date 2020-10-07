import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';
import { AnyAction } from 'redux';
import { ICollection } from '../interfaces';

const config = {
  apiKey: 'AIzaSyAa_C6DKHQj8PxvclsUC-shdJzhe6wV1k0',
  authDomain: 'ecommerce-db-509e9.firebaseapp.com',
  databaseURL: 'https://ecommerce-db-509e9.firebaseio.com',
  projectId: 'ecommerce-db-509e9',
  storageBucket: 'ecommerce-db-509e9.appspot.com',
  messagingSenderId: '456441903886',
  appId: '1:456441903886:web:b1ae302b01c451383f355f',
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (
  userAuth: any,
  additionalData?: any
) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};
export const addCollectionAndDocuments = async (
  collectionKey: string,
  objectsToAdd: ICollection[]
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach((obj: ICollection) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections: any) => {
  const transformedCollection = collections.docs.map((doc: any) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });
  return transformedCollection.reduce(
    (accumulator: any, collection: ICollection) => {
      accumulator[collection.title.toLowerCase()] = collection;
      return accumulator;
    },
    {}
  );
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
