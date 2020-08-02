import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
	apiKey: process.env.REACT_APP_APIKEY,
	authDomain: process.env.REACT_APP_AUTHDOMAIN,
	databaseURL: process.env.REACT_APP_DB_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSENGER_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const firebaseStorage = firebase.storage()
const firebaseStorageRef = firebaseStorage.ref()

const firebaseDB = firebase.database()
const doordashSalesDB = firebaseDB.ref('doordash_sales')
const easiSalesDB = firebaseDB.ref('easi_sales')
const eatclubSalesDB = firebaseDB.ref('eatclub_sales')
const hungrypandaSalesDB = firebaseDB.ref('hungrypanda_sales')
const orderupSalesDB = firebaseDB.ref('orderup_sales')
const squareSalesDB = firebaseDB.ref('square_sales')
const ubereatsSalesDB = firebaseDB.ref('ubereats_sales')
const webflowSalesDB = firebaseDB.ref('webflow_sales')
const allPlatformSalesDB = firebaseDB.ref('platform_sales')

export default {
	doordashSalesDB,
	easiSalesDB,
	eatclubSalesDB,
	hungrypandaSalesDB,
	orderupSalesDB,
	squareSalesDB,
	ubereatsSalesDB,
	webflowSalesDB,
	allPlatformSalesDB,
	firebaseStorageRef,
}
