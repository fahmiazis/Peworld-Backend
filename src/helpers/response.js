module.exports = (res, message, additionalData = {}, status = 200, success = true) => {
  return (
    res.status(status).send({
      success,
      message,
      ...additionalData
    })
  )
}
