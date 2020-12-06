const admin = require('firebase-admin')

const serviceAccount = require('../config/dchat-e3451-firebase-adminsdk-5ahco-a5d5f2c406.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dchat-e3451.firebaseio.com'
})

const messaging = (deviceToken, username, content) => {
  admin.messaging().send({
    token: deviceToken,
    notification: {
      title: `You got message from ${username}`,
      body: content.length > 20 ? content.slice(0, 20).concat('...') : content
    },
    priority: 'high'
  }).then((response) => {
    console.log(`Successfully sent notification: ${response}`)
  }).catch((err) => {
    console.log(err.message)
  })
}

module.exports = messaging
