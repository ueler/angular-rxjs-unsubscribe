# Examples with further explanations
## How to run the examples by yourself
The project was set up using the latest [Angular CLI](https://github.com/angular/angular-cli) (version 17).

To run the examples, cd into ``angular-app`` folder and install the Angular app with
``
npm install
``.

Then start it using
``
npm start
``.

## The questions
We want to answer the following questions:

### 1. Can we run into the problem of unwanted side effects?
To investigate this issue, we use the scenario that we want to set the document title (inside the component we navigated to)
dynamically on behalf of a observable. 
To this end, we use the Angular title service (https://angular.io/guide/set-document-title).

In each experiment, we set the title in the observables callback inside component ``XY``, then navigate to the ``EmptyComponent`` 
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
timer(0, 1000)
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

Note: If you don't use any references (like member variables) from the component in the callback, 
the component gets garbage collected and there is no memory leak.

### Summary
__Always unsubscribe if the observable does not complete or if you are not sure if it completes, 
since the callback logic still runs in the background otherwise, 
possibly creating memory leaks and unwanted side effects.__

## Observables that eventually complete
We created the component ``RxjsTimerCompleteComponent``. It contains the following observable:
```
timer(0, 1000)
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

### Summary
__Always unsubscribe if you execute code with side effects in your callback.__

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

### Investigation method
We added a little server written in Go under the folder ``go-server`` to the project, 
such that the effect of delayed network calls can be demonstrated.

Furthermore we added the component ``HttpclientComponent`` which issues a GET call to the API exposed by the Go Server.
The GET call delays the response by 5 seconds and then returns an object with a title property.
The component sets the document title with the received data:

```  
this.httpClient.get<ApiResponse>('/api').subscribe((result) => {
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

### Summary
__Always unsubscribe if you execute code with side effects in your callback.__\
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

Note: This is only valid for ``ActivatedRoute`` observables and not for other router observables (as shown below)!


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