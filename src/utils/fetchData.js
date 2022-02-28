// prettier-ignore
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

//* Fetch all docs from Firebase/Firestore
export async function getAllFeeds(firestoreDb) {
  const feeds = await getDocs(
    query(collection(firestoreDb, 'videos'), orderBy('id', 'desc'))
  );

  return feeds.docs.map((doc) => doc.data());
}

//* Fetch the user information via userId
export async function getUserInfo(firestoreDb, userId) {
  const userRef = doc(firestoreDb, 'users', userId);

  const userSnapshot = await getDoc(userRef);
  if (userSnapshot.exists()) {
    return userSnapshot.data();
  } else {
    return 'No such document';
  }
}
//* Fetch specific video information from VideoPinDetail
export const getSpecificVideo = async (firestoreDb, videoId) => {
  const videoRef = doc(firestoreDb, 'videos', videoId);

  const videoSnap = await getDoc(videoRef);
  if (videoSnap.exists()) {
    return videoSnap.data();
  } else {
    return 'No Such Document';
  }
};
