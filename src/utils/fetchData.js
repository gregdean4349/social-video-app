// prettier-ignore
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';

//* Fetch all docs from Firebase/Firestore
export async function getAllFeeds(firestoreDb) {
  const feeds = await getDocs(
    query(collection(firestoreDb, 'videos'), orderBy('id', 'desc'))
  );
  return feeds.docs.map((doc) => doc.data());
}

//* Get recommended video Feeds
export const recommendedFeed = async (firestoreDb, categoryId, videoId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, 'videos'),
      where('category', '==', categoryId),
      where('id', '!=', videoId),
      orderBy('id', 'desc')
    )
  );
  return feeds.docs.map((doc) => doc.data());
};

//* User Uploaded videos
export async function userUploadedVideos(firestoreDb, userId) {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, 'videos'),
      where('userId', '==', userId),
      orderBy('id', 'desc')
    )
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

//* Selected Category Feeds
export const categoryFeeds = async (firestoreDb, categoryId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, 'videos'),
      where('category', '==', categoryId),
      orderBy('id', 'desc')
    )
  );
  return feeds.docs.map((doc) => doc.data());
};

//* Delete selected video
export const deleteVideo = async (firestoreDb, videoId) => {
  await deleteDoc(doc(firestoreDb, 'videos', videoId));
};
