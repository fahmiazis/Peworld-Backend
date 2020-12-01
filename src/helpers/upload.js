const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) {
      return cb(new Error('Image cant be null'), false)
    }
    cb(null, 'assets/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1]
    const fileName = req.user ? `${req.user.id}_${new Date().getTime().toString().concat('.').concat(ext)}` : `${new Date().getTime().toString().concat('.').concat(ext)}`
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG', 'image/svg+xml']
  if (allowedMimes.includes(file.mimetype)) {
    return cb(null, true)
  }
  return cb(new Error('Invalid file type. Only image files are allowed.'), false)
}

module.exports = multer({ storage, fileFilter, limits: { fileSize: 500000 } }).array('picture', 3)
