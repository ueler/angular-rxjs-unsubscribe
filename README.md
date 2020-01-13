# When should I unsubscribe from RxJS observables in Angular components?
## Intro
There's a lot of confusion in the community about the question if and when you have to unsubscribe manually
from RxJS observables in Angular components.

Although there are some quite nice StackOverflow posts about this question, there is no clear guide 
that contains all relevant information explained by examples.

### Angular components and observables
Our guide focuses on issues with components using observables. 

A typical component lifecycle in an Angular CRUD application contains the following steps (simplified version):
1. User navigates to component ``A``
2. Component ``A`` gets initialized (constructor and ``ngOnInit`` are invoked)
3. Some logic is called to load data (e.g. using ``HttpClient``).  
   _Subscriptions to observables are made._
4. User navigates to another component ``B``
5. Component ``A`` gets destroyed (``ngOnDestroy`` is invoked)
6. ...

This repository provides a guide explaining when you have to unsubscribe manually from subscriptions
 (when component gets destroyed) made in step 3 together with the examples.

## A guide for common situations
Whether you have to unsubscribe or not depends on the callback logic you are using in the observables subscription.

### Side effects
If the callback code from the subscription executes code with side effects (e.g. affecting global application state) 
you should always consider to manually unsubscribe when the component gets destroyed. 
Otherwise the current and correct application state can be falsely overwritten by callback execution from a destroyed component.

### Observables that don't complete
If the subscription callback from an observables that does not eventually complete uses member variables from the component, 
the destroyed component cannot be garbage collected thus resulting in a memory leak. 
Therefore you should always unsubscribe in that case.

Observables that don't eventually complete (for example an observable emitting a value each second) should be cancelled always, 
since the callback logic from the destroyed component still runs (infinitely) in the background otherwise.

### Angular HttpClient
The Angular HttpClient creates an observable that eventually completes. Therefore the same applies.

### Angular ActivatedRoute
For observables from the ``ActivatedRoute`` you do not have to unsubscribe manually.

### Angular Router events
For Angular Router events (``NavigationStart``, ``NavigationEnd``, ...) you may have to manually unsubscribe.

### Overview
When you should unsubscribe when the component gets destroyed.

|                                        | Side effects    | Memory leaks | Should unsubscribe |
|----------------------------------------|-----------------|--------------|--------------------|
| _Observables that don't complete_      | Possible (1)    | Possible (2) | Yes                |
| _Observables that eventually complete_ | Possible (1)    | No (3)       | Depends (1)        |
| _Angular HttpClient_                   | Possible (1)    | No (3)       | Depends (1)        |
| _Angular ActivatedRoute_               | No              | No           | No (4)             |
| _Angular Router events_                | Possible (1)    | Possible (2) | Yes                |

(1): If you execute methods with side effects in the subscription callback.  
(2): If you use member variables from the component in the subscription callback.  
(3): Assuming the observable completes.  
(4): You don't have to, but are free to unsubscribe anyway.

# Further explanation and examples
## How to run the examples by yourself
The project was set up using the latest [Angular CLI](https://github.com/angular/angular-cli) (version 8.3.6). Therefore you can just clone the repository and run
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
To investigate this issue, we use the scenario, that we want to set the document title (inside the component we navigated to)
dynamically on behalf of a observable. 
To this end, we use the Angular title service (https://angular.io/guide/set-document-title).

In each experiment, we set the title in the observables callback inside component ``XY``, navigate to the ``EmptyComponent`` 
(which does nothing else than setting its own title), and observe if the title still gets updated.

### 2. Can we run into the problem of memory leaks?
We navigate from the component ``XY`` with the observable (we want to study) to the ``EmptyComponent``. 
Under normal circumstances, the component ``XY`` should be garbage collected. 
However, it can happen that the component cannot be garbage collected due to references used in observable callbacks.

We will use Google Chrome's memory snapshot tool to see if the components get garbage collected or not.


## Observables that don't complete
The first and most trivial case is an observable that does not complete.

Say you have a timer observable in your component, like in our case study component ``RxjsTimerComponent``
```
this.subscription = timer(0, 1000)
    .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
    });
```
This is an infinite timer observable, that executes the callback each second. 
On each emit, we increase a counter and set the document title with the title service.

### Outcomes
#### Side effects
As expected, after routing from the ``RxjsTimerComponent`` to the ``EmptyComponent``, 
the document title gets updated each second. 
So the observable still runs after the ``RxjsTimerComponent`` was destroyed. 
So we have an unwanted side effect in our example.

#### Memory leaks
As expected, after routing to the ``EmptyComponent``, the ``RxjsTimerComponent`` is still in memory and doesn't
get garbage collected. This makes sense, since there is still a reference to ``this.counter`` 
and ``this.titleService`` in the observables callback method.

In fact, by navigating back and forth between ``EmptyComponent`` and ``RxjsTimerComponent`` we can create many 
``RxjsTimerComponent`` objects that don't get cleaned up. Thus we indeed created a memory leak in our example.

NOTE: If you don't use any references (like member variables) from the component in the callback, 
the component gets garbage collected and there is no memory leak.

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
since the callback logic still runs in the background otherwise, 
possibly creating memory leaks and unwanted side effects.__

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

## Angular routing: ParamMap and QueryParamMap (ActivatedRoute) observables
The Angular documentation already gives the answer if we should unsubscribe in this case:

> When subscribing to an observable in a component, you almost always arrange to unsubscribe when the component is destroyed. 
> 
> There are a few exceptional observables where this is not necessary. The ActivatedRoute observables are among the exceptions.
>
> The ActivatedRoute and its observables are insulated from the Router itself. The Router destroys a routed component when it is no longer needed and the injected ActivatedRoute dies with it.
> Feel free to unsubscribe anyway. It is harmless and never a bad practice.

We created the component ``RouterParamMapComponent`` to verify this by an example.
The example used the following code (for the queryParamMap) in the ``ngOnInit()`` method.
```
this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
  this.queryParamMap = queryParamMap;
  this.titleService.setTitle(queryParamMap.get('queryParam'));
});
```

### Outcomes and summary
The component gets garbage collected (after the second navigation from the component, not the first) and no side-effects
 were noticed. The callback is not executed anymore after navigated away from the component.
 
So the statement from the documentation is correct and you don't have to manually unsubscribe when using observables
from ``ActivatedRoute``.

NOTE: This is only valid for ``ActivatedRoute`` observables and not for other router observables (as shown below)!


## Angular routing: Router events (NavigationStart, etc...)
We created the component ``RouterEventsComponent`` with the following subscription in ``ngOnInit``:
```
this.router.events.subscribe((event) => {
  console.log('routerEvent', event);
  this.event = event;
});
```
To investigate how this observable behaves, we navigated to the component and then navigated to other components afterwards.

### Outcomes
#### Side effects
The observables callback is still executed even when the component is destroyed. So there can be unwanted side effects,
when using certain code in the callback.

#### Memory leak
The above version creates a memory leak, since we use a reference to the component in the callback. 
Each time we navigate to the component a new dangling component (that cannot be garbage collected) is created.
If no reference is used, the component gets garbage collected.

### Summary
You should always unsubscribe when using the events observables from the ``Router`` in components 
(there is one exception tough, namely if you use it in the root component) as the subscription is still alive, even if
the component was destroyed by Angular.

## Memory leaks in component trees
We wondered if a subcomponent of a component with an observable that does not complete could maybe 
cause a memory leak on the whole component tree upwards.

To this end we created ``ComponentTreeComponent``, which has an infinite time observable in the most inner
component.

### Outcomes
As expected, only the component with the timer does not get garbage collected.
This is good news, as this means the third party components (as used as in this example) 
cannot affect memory leaks on your components.

# Recommended ways to unsubscribe
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

## Unsubscribe with ``takeUntil``
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

## Using ``untilDestroyed``
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

# Other resources
### Angular/RxJs When should I unsubscribe from Subscription:
https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription

### Is it necessary to unsubscribe from observables created by Http methods?
https://stackoverflow.com/questions/35042929/is-it-necessary-to-unsubscribe-from-observables-created-by-http-methods
