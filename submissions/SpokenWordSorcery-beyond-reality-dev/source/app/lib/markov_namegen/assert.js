function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg)
    }
  }
  
  module.exports = { assert }
  