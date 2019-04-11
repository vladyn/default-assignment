import { channel } from './clientConnector';

export function pronounceWinner(element?: HTMLSpanElement, winners?: HTMLSpanElement[]): void {
  if (arguments.length === 0) {
    channel.send('draw!');
    return;
  }
  const transitionEvent = whichTransitionEvent();
  const winner: string = element.classList.contains('player-one') ? 'player-one' : 'player-two';
  const avatar: HTMLCollectionOf<Element> = document.getElementsByClassName('flc-game-avatar');
  element.addEventListener(transitionEvent, transitionEndCallback);

  function transitionEndCallback() {
    element.removeEventListener(transitionEvent, transitionEndCallback);
    for (const c in winners) {
      winners[c].classList.add('winner');
    }
    Array.from(avatar).forEach((e) => {
      e.classList.contains(winner) ? e.classList.add('winner') : null;
    });
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
