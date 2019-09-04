import Surface from './Surface';
import {exitDocument} from "metal-dom";

class DelayedAsyncTransitionSurface extends Surface {


  /**
   * Surface class that delays the transition until the method finishTransition is called
   * @constructor
   * @extends {Surface}
   */
  constructor(id) {
    super(id);

    /**
     * Holds the last transition promise.
     * @type {Promise}
     * @default null
     * @protected
     */
    this.surfaceTransitionPromise = null;

    /**
     * Holds the last transition promise resolver.
     * @type {Function}
     * @default null
     * @protected
     */
    this.surfaceTransitionResolver = null;
  }

  /**
   * Prepares the screen content from a surface to be shown until the method finishTransition is called.
   * @param {String} screenId The screen id to show.
   * @return {Promise} Pauses the navigation until it is resolved.
   */
  show(screenId) {
    var from = this.activeChild;
    var to = this.getChild(screenId);
    if (!to) {
      to = this.defaultChild;
    }
    this.activeChild = to;

    if (from && from !== to) {
      //Add a namespace to all the ids of the old screen to avoid collisions
      from.querySelectorAll('[id]').forEach(element => element.id = 'senna_to_be_removed_' + element.id);
    }

    this.surfaceTransitionPromise = new Promise(resolve => {
      this.surfaceTransitionResolver = resolve;
    }).then(() => {
      const transitionEnd = () => {
        if (from && from !== to) {
          exitDocument(from);
        }
      };

      super.transition(from, to)
        .then(transitionEnd)
        .catch(transitionEnd);
    })

    return Promise.resolve();
  }

  remove(screenId) {
    Promise.all([this.surfaceTransitionPromise]).then(() => { super.remove(screenId); });
  }

  /**
   * Finishes the transition to show the screen content from a surface
   */
  finishTransition() {
    this.surfaceTransitionResolver && this.surfaceTransitionResolver();
    this.surfaceTransitionResolver = null;
  }

}

export default DelayedAsyncTransitionSurface;
