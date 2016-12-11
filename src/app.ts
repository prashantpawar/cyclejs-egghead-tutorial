import { Observable } from 'rxjs';
import { run } from '@cycle/rxjs-run';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { button, p, label, div, makeDOMDriver, VNode } from '@cycle/dom';

interface ISources {
    DOM: DOMSource;
}

interface ISinks {
    DOM: Observable<VNode>;
}

function main(sources: ISources): ISinks {
  const decrementClick$ = sources.DOM
    .select('#decrement').events('click');
  const incrementClick$ = sources.DOM
    .select('#increment').events('click');
  

  const decrementAction$ = decrementClick$.map(ev => -1);
  const incrementAction$ = incrementClick$.map(ev => +1);
  
  const number$ = Observable.of(0)
    .merge(decrementAction$)
    .merge(incrementAction$)
    .scan((prev, curr) => prev + curr);

  const sinks: ISinks = {
    DOM: number$.map(number =>
      div([
        button('#decrement', 'Decrement'),
        button('#increment', 'Increment'),
        p([
          label(String(number))
        ])
      ])
    )
  };

  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers);
