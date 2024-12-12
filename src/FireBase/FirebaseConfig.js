const admin = require('firebase-admin')
const serviceAccount = require('./firebase-adminsdk.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  //   databaseURL: 'https://TechHome-55DFA.firebaseio.com'
  // projectId: 'techhome-55dfa'
})

module.exports = admin
