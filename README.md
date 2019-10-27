# When should I unsubscribe from RxJS observables in Angular?
There's a lot of confusion in the community about the question if you have to unsubscribe 
from RxJS observables in Angular.

Although there are some quite nice StackOverflow posts about this questions, there is no clear guidance 
that contains all relevant information explained by examples.

This repository provides the necessary Angular project to examine the problems by yourself and a guide for common situations.

### Some resources:
##### Angular/RxJs When should I unsubscribe from Subscription:
https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription

##### Is it necessary to unsubscribe from observables created by Http methods?
https://stackoverflow.com/questions/35042929/is-it-necessary-to-unsubscribe-from-observables-created-by-http-methods


## How to run the examples by yourself
The project was set up using the latest Angular CLI. Therefore you can just clone the repository and run
``
npm start
``
in the
``
angular-app
``
folder.

## The questions and the study method
We want to answer the following questions in each case study:
### 1. Can we run into the problem of unwanted side effects?
To investigate this issue, we use the realistic scenario, that we want to set the document title 
dynamically on behalf of a observable. To this end, we use the Angular title service (https://angular.io/guide/set-document-title).

We set the title in the observables callback, navigate to the ``EmptyComponent`` 
(which does nothing else than setting its own title), and observe if the title still gets updated.

### 2. Can we run into the problem of memory leaks?
We again route from our component of case study to the ``EmptyComponent``. Under normal circumstances, 
the component we came from should be garbage collected. 
However, it can happen that the component cannot be garbage collected due to references used in observable callbacks.

We will use Google Chrome's memory snapshot tool to see if the components get garbage collected or not.


## Observables that don't complete
The first and most trivial case is that you have an observable, that does not complete.

Say you have a timer observable, like in our case study component ``RxjsTimerComponent``
```
this.subscription = timer(0, 1000)
    .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
    });
```
The is an infinite timer observable, that emits each second. On each emit, we increase a counter and set 
the document title with the title service.

### Outcomes
#### Side effects
As expected, after routing to the ``EmptyComponent``, the document title gets updated each second. 
So the observable still runs after the ``RxjsTimerComponent`` was destroyed. 
So we have an unwanted side effect in our example.

#### Memory leaks
As expected, after routing to the ``EmptyComponent``, the ``RxjsTimerComponent`` is still in memory and doesn't
get garbage collected. This makes sense, since there is still a reference to ``this.counter`` 
and ``this.titleService`` in the observables callback method.

In fact, by navigating back and forth between ``EmptyComponent`` and ``RxjsTimerComponent`` we can create many 
``RxjsTimerComponent`` objects that doesn't get cleaned up. Thus we indeed created a memory leak issue in our example.

NOTE: If you don't use any references (like member variables) from the component in the callback, the component gets garbage collected 
and there is no memory leak.

### Countermeasures
One countermeasure (among others at the end of this readme) is to manually unsubscribe in ``ngOnDestroy``.
```
ngOnDestroy() {
    // Avoid side effects and memory leak by unsubscribing:
    this.subscription.unsubscribe();
}
```
With this statement, the side effects and the memory leak are avoided.

### Summary
__ALWAYS unsubscribe if the observable does not complete or if you are not sure if it completes, 
when using 1. code with side effects or 2. accessing member variables in the callback.__


## Observables that eventually complete
We created the component ``RxjsTimerComplete``. It contains the following observable:
```
this.subscription = timer(0, 1000)
    .pipe(take(5))
    .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
    });
```
We used a pipe with ``take(5)``, thus the observable we subscribe to takes only
the first 5 values from the source and then completes.

Again, we increase a counter on each emit and set 
the document title with the title service.

### Outcomes
#### Side effects
If we navigate, before the last value is emitted (i.e. within the first 5 seconds), we can observe 
that the document title is still updating. Thus we have an unwanted side effect as in the first case study, 
as long as the observable is not complete yet.

Of course there is _no_ unwanted side effect _in our example_, if we wait and navigate after the first 5 values were emitted and 
the observable completed.

#### Memory leak
No matter if we navigate before the observable completes or afterwards - 
the component ``RxjsTimerComplete`` always eventually gets garbage collected after it completed.
So there is no memory leak.

### Countermeasures
One countermeasure to avoid possible side effects (among others at the end of this readme) is to manually unsubscribe in ``ngOnDestroy``.
```
ngOnDestroy() {
    // Avoid side effects by unsubscribing:
    this.subscription.unsubscribe();
}
```
With this statement, the side effects and the memory leak are avoided.

### Summary
__ALWAYS unsubscribe if you execute code with side effects in your callback.__

## Observables from the Angular HttpClient
Let's have a look at the angular source code to understand how an observable created from the HttpClient works.
```
if (ok) {
    observer.next(new HttpResponse({
        // ... code omitted ...
    }));

    observer.complete();
} else {
    observer.error(new HttpErrorResponse({
        // ... code omitted ...
    }));
}
```
The important part is ``observer.complete()`` in successful call and ``observer.error(...)`` in error case, 
which means the observable has finished and does not emit any more values.

This means that the same findings from the case study [Observables that eventually complete](#Observables that eventually complete) apply.

Why? Since network calls can be arbitrarily delayed, the observable can complete when you already navigated to another component.

## Case study
We added a little server written in Go under the folder ``go-server`` to the project, 
such that the effect of delayed network calls can be demonstrated.

Furthermore we added the component ``HttpclientComponent`` which issues a GET call to the API exposed by the Go Server.
The GET call delays the response by 5 seconds and then returns an object with a title property.
The component sets the document title with the received data:

```  
this.subscription = this.httpClient.get<ApiResponse>('/api').subscribe((result) => {
     this.title = result.title;
     this.titleService.setTitle(result.title);
});
```

### Outcomes
As already mentioned, we observe the same outcome as with an observable that eventually completes.

#### Side effects
Are possible due to network latencies. The callback still gets executed, even if the user already navigated to another component.

#### Memory leak
After the call completes the component gets garbage collected (even if navigated to another component).

### Countermeasures
One countermeasure to avoid possible side effects (amongst others at the end of this readme) is to manually unsubscribe in ``ngOnDestroy``.
```
ngOnDestroy() {
    // Avoid side effects by unsubscribing:
    this.subscription.unsubscribe();
}
```
With this statement, the side effects and the memory leak are avoided.

### Summary
__ALWAYS unsubscribe if you execute code with side effects in your callback.__
Many get that wrong, since they have almost no latency in their network calls when testing their application.
If you do not execute methods with unwanted side effects, you do not have to unsubscribe.
Memory leaks are avoided by the HttpClient as the observable completes itself.

## Recommended ways to unsubscribe
The obvious way of unsubscribing is how it is done in our examples: Assign the subscription to a class 
property and unsubscribe in the ``ngOnDestroy()`` method.

However, its not feasible for large applications with many subscriptions, 
as its cumbersome to write and introduces a lot of obfuscating code.

Another way of handling it, would be to collect all subscriptions and unsubscribe them at once:
```
private readonly subscription = new Subscription();

everySecond = timer(0, 1000);
everyThirdSecond = timer(0, 3000);

constructor() {
}

ngOnInit() {
    this.subscription.add(this.everySecond.subscribe(() => {
      // some logic here
    }));
    this.subscription.add(this.everyThirdSecond.subscribe(() => {
      // some logic here
    }));
}

ngOnDestroy() {
    this.subscription.unsubscribe();
}
``` 
However, same drawbacks here: Cumbersome and obfuscating.

### Unsubscribe with ``takeUntil``
A cleaner way of unsubscribing is using ``takeUntil``.

Official docs for ``takeUntil``: ``takeUntil(notifier: Observable<any>)`` — Emits the values emitted by the source Observable until a notifier Observable emits a value.

Example code:
```
private readonly ngDestroy = new Subject();

everySecond = timer(0, 1000);
everyThirdSecond = timer(0, 3000);

constructor() {
}

ngOnInit() {
    this.everySecond.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        // some logic here
      });
    
    this.everyThirdSecond.pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        // some logic here
      });
}

ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
}
```
When the component gets destroyed, the observable ``ngDestroy`` gets completed, causing the subscriptions to complete.
Thus memory leaks and side effects are avoided.

Drawbacks: As with the other methods, it's still quite verbose and error-prone.

NOTE: takeUntil operator should always come last (https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef)

### Using ``untilDestroyed``
There is an npm package called ``@ngneat/until-destroy`` (https://github.com/ngneat/until-destroy). 

You can install it (for Angular versions using Ivy) with
```
npm install --save @ngneat/until-destroy
```

Or for previous Angular versions with:
```
npm install --save ngx-take-until-destroy
```

It simplifies the unsubscription handling a lot. It internally creates a ``Subject`` and uses ``takeUntil``, hooked into ``ngOnDestroy``.
The above code simplifies to:
```
everySecond = timer(0, 1000);
everyThirdSecond = timer(0, 3000);

constructor() {
}

ngOnInit() {
    this.everySecond.pipe(untilDestroyed(this))
      .subscribe(() => {
        // some logic here
      });
    
    this.everyThirdSecond.pipe(untilDestroyed(this))
      .subscribe(() => {
        // some logic here
      });
}

ngOnDestroy() {
    // needed for untilDestroyed
}
```
Only drawback: We have to implement ``ngOnDestroy`` everywhere we want to use ``untilDestroyed``.
However it should be easy to write a linting rule to enforce this.

## Conclusion
Whether you have to unsubscribe or not heavily depends on the callback logic you are using.

If the callback executes code with side effects you should always unsubscribe.

If the callback uses member variables from the component class there can be a memory leak when using observables that don't complete, 
therefore you should unsubscribe in that case.

|                                        | Side effects    | Memory leaks |
|----------------------------------------|-----------------|--------------|
| _Observables that don't complete_      | Possible(1)     | Possible(2)  |
| _Observables that eventually complete_ | Possible(1)     | No           |
| _Angular HttpClient_                   | Possible(1)     | No           |

Possible(1): If you execute methods with side effects in the callback.

Possible(2): If you use member variables from the component in the callback.

## TODO
- Explain effect on component tree
- Explain side effects
