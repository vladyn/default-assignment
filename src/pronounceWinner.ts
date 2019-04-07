import { channel } from './clientConnector';

export function pronounceWinner(element?: HTMLSpanElement, winners?: HTMLSpanElement[]): void {
  if (arguments.length === 0) {
    channel.send('draw!');
    return;
  }
  const transitionEvent = whichTransitionEvent();

  element.addEventListener(transitionEvent, transitionEndCallback);

  function transitionEndCallback() {
    element.removeEventListener(transitionEvent, transitionEndCallback);
    for (const c in winners) {
      winners[c].classList.add('winner');
    }
    channel.send('winner!');
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
