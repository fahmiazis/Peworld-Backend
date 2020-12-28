const admin = require('firebase-admin')

const serviceAccount = require('../config/hiredjobapp-1c2ff-firebase-adminsdk-9q4rj-d6bdba743b.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'firebase-adminsdk-9q4rj@hiredjobapp-1c2ff.iam.gserviceaccount.com'
})

const messaging = (deviceToken, username, content) => {
  admin.messaging().send({
    token: deviceToken,
    notification: {
      title: `You got message from ${username}`,
      body: content.length > 20 ? content.slice(0, 20).concat('...') : content
    },
  }).then((response) => {
    console.log(`Successfully sent notification: ${response}`)
  }).catch((err) => {
    console.log(err.message)
  })
}

module.exports = messaging
