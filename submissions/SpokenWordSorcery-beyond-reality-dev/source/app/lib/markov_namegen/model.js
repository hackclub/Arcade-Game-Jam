const assert = require("assert")

/**
 * A Markov model built using string training data.
 */
class Model {
  /**
   * Creates a new Markov model.
   * @param   data    The training data for the model, an array of words.
   * @param   order   The order of model to use, models of order "n" will look back "n" characters within their context when determining the next letter.
   * @param   prior   The dirichlet prior, an additive smoothing "randomness" factor. Must be in the range 0 to 1.
   * @param   alphabet    The alphabet of the training data i.e. the set of unique symbols used in the training data.
   */
  constructor(data, order, prior, alphabet) {
    assert(alphabet.length > 0 && data.length > 0)
    assert(prior >= 0 && prior <= 1)

    this._order = order
    this._prior = prior
    this._alphabet = alphabet

    this._observations = new Map()
    this.train(data)
    this.buildChains()
  }

  /**
   * Attempts to generate the next letter in the word given the context (the previous "order" letters).
   * @param   context The previous "order" letters in the word.
   */
  generate(context) {
    const chain = this._chains.get(context)
    if (chain === undefined) {
      return null
    }
    assert(chain.length > 0)
    return this._alphabet[this.selectIndex(chain)]
  }

  /**
   * Retrains the model on the newly supplied data, regenerating the Markov chains.
   * @param   data    The new training data.
   */
  retrain(data) {
    this.train(data)
    this.buildChains()
  }

  /**
   * Trains the model on the given training data.
   * @param   data    The training data.
   */
  train(data) {
    while (data.length !== 0) {
      let d = data.pop()
      d = `${"#".repeat(this._order)}${d}#`
      for (let i = 0; i <= d.length - this._order; i++) {
        const key = d.substring(i, i + this._order)
        let value = this._observations.get(key)
        if (value == null) {
          value = new Array()
          this._observations.set(key, value)
        }
        value.push(d.charAt(i + this._order))
      }
    }
  }

  /**
   * Builds the Markov chains for the model.
   */
  buildChains() {
    this._chains = new Map()

    for (const context of this._observations.keys()) {
      for (const prediction of this._alphabet) {
        let value = this._chains.get(context)
        if (value == null) {
          value = new Array()
          this._chains.set(context, value)
        }
        value.push(
          this._prior +
            this.countMatches(this._observations.get(context), prediction)
        )
      }
    }
  }

  countMatches(arr, v) {
    if (arr === undefined) {
      return 0
    }

    let i = 0
    for (const s of arr) {
      if (s === v) {
        i++
      }
    }

    return i
  }

  selectIndex(chain) {
    const totals = new Array()
    let accumulator = 0

    for (const weight of chain) {
      accumulator += weight
      totals.push(accumulator)
    }

    const rand = Math.random() * accumulator
    for (let i = 0; i <= totals.length; i++) {
      if (rand < totals[i]) {
        return i
      }
    }

    return 0
  }
}

module.exports = { Model }