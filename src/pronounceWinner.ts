import { channel } from './clientConnector';
import { resetBoard } from './resetBoard';

export function pronounceWinner(element: HTMLSpanElement, winners: HTMLSpanElement[]): void {
  const transitionEvent = whichTransitionEvent();

  element.addEventListener(transitionEvent, transitionEndCallback);

  function transitionEndCallback() {
    element.removeEventListener(transitionEvent, transitionEndCallback);
    for (const c in winners) {
      winners[c].classList.add('winner');
    }
    channel.send('winner!');
    resetBoard();
  }

  function whichTransitionEvent() {
    let t;

    const animations = {
      animation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd'
    };

    for (t in animations) {
      if (element.style[t] !== undefined) {
        return animations[t];
      }
    }
  }
}

export default pronounceWinner;
