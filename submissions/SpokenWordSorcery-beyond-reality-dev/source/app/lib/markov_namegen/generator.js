const { assert } = require("./assert")
const { Model } = require("./model")

/**
 * A procedural word generator that uses Markov chains built from a user-provided array of words.
 *
 * This uses a simplified version of Katz's back-off model, which is an approach that uses high-order models. It looks for the next letter based on the last "n" letters, backing down to lower order models when higher models fail.
 *
 * This also uses a Dirichlet prior, which acts as an additive smoothing factor, introducing a chance for random letters to be be picked.
 *
 * @see http://www.samcodes.co.uk/project/markov-namegen/
 * @see https://www.roguebasin.com/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme#Katz_Back-off
 * @see https://en.wikipedia.org/wiki/Katz%27s_back-off_model
 * @see https://en.wikipedia.org/wiki/Additive_smoothing
 */

class Generator {
  /**
   * Creates a new procedural word Generator.
   * @param   data    Training data for the generator, an array of words.
   * @param   order   Highest order of model to use - models of order 1 through order will be generated.
   * @param   prior   The dirichlet prior/additive smoothing "randomness" factor.
   * @param   backoff Whether to fall back to lower order models when the highest order model fails to generate a letter.
   */
  constructor(data, order, prior, backoff) {
    assert(order >= 1)
    assert(prior >= 0)

    this.order = order
    this.prior = prior
    this._backoff = backoff

    const letters = new Set()
    for (const word of data) {
      for (const letter of word) {
        letters.add(letter)
      }
    }

    const domain = [...letters].sort((a, b) => {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    })
    domain.unshift("#")

    this._models = []
    if (this._backoff) {
      for (let i = 0; i < order; i++) {
        this._models.push(new Model([...data], order - i, prior, domain)) // from highest to lowest order
      }
    } else {
      this._models.push(new Model(data, order, prior, domain))
    }
  }

  /**
   * Generates a word.
   * @return The generated word.
   */
  generate() {
    let word = "#".repeat(this.order)
    let letter = this.getLetter(word)

    while (letter !== "#" && letter != null) {
      if (letter != null) {
        word += letter
      }
      letter = this.getLetter(word)
    }

    return word
  }

  /**
   * Generates the next letter in a word.
   * @param   word The context the models will use for generating the next letter.
   * @return  The generated letter, or null if no model could generate one.
   */
  getLetter(word) {
    assert(word.length > 0)

    let letter = null
    let context = word.substring(word.length - this.order, word.length)
    for (const model of this._models) {
      letter = model.generate(context)
      if (letter == null) {
        context = context.substring(1)
      } else {
        break
      }
    }

    return letter
  }
}

module.exports = { Generator }
