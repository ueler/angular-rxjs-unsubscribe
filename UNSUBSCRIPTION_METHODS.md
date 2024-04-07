# Recommended ways to unsubscribe
## TL;DR
- Use ``@ngneat/until-destroy``: https://github.com/ngneat/until-destroy
- For Angular 16+: You can use the built-in ``takeUntilDestroyed`` operator
- For observables only used in templates, you can also make use of the built-in ``async`` pipe.

For every method, you find an example component under [angular-app/src/app/unsubscription-methods](angular-app/src/app/unsubscription-methods).

## Recommended methods
### Using ``untilDestroyed``
There is an npm package called ``@ngneat/until-destroy`` (https://github.com/ngneat/until-destroy).

You can install it (for Angular versions using Ivy) with
```
npm install --save @ngneat/until-destroy
```

It simplifies the subscription handling a lot.
It internally creates a ``Subject`` and uses ``takeUntil``, hooked into ``ngOnDestroy``.
As soon as the component is destroyed, the observable completes immediately.

Example usage:
```
@UntilDestroy() // <- annotate component with this
@Component({
  // ...
})
export class UntilDestroyedComponent {

  private everySecond$ = timer(0, 1000);

  constructor() {
    this.everySecond$.pipe(untilDestroyed(this)) // <- pipe the observable with the untilDestroyed operator
      .subscribe(() => {
        // some logic here
      });
  }
}
```

Drawback: You have to annotate each component.

Note: For usage with pre-Ivy Angular versions (Angular 8 and below) go to the projects GitHub page.

### Using the built-in ``takeUntilDestroyed``
This is only available for Angular 16 or higher (https://angular.io/api/core/rxjs-interop/takeUntilDestroyed).

It's usage is very similar to the above method. As soon as the component is destroyed, the observable completes immediately.
 You can use it like this:
```
@Component({
  // ...
})
export class TakeUntilDestroyedComponent {

  private everySecond$ = timer(0, 1000);

  constructor() {
    this.everySecond$.pipe(takeUntilDestroyed()) // <-- pipe the observable with the operator
      .subscribe(() => {
        // some logic here
      });
  }
}
```

Advantage over ``untilDestroyed``: You don't have to annotate the component. \
Note: If you are not subscribing in the constructor of the component, you have to pass a reference of the
``DestroyRef`` which you then have to inject into the component.


### Use the ``async`` pipe
If you are only subscribing in the template, you can just use the native ``async`` pipe in the template.
It automatically unsubscribes when the component is destroyed.

Example usage:
```
<div>{{ everySecond$ | async }}</div>
```

Note: As soon as a subscription is made inside the components controller, you cannot use it.

## Other methods
### Subscription variable
One way is to assign the subscription to a class property and manually unsubscribe in ``ngOnDestroy``.
```
private subscription: Subscription;

ngOnInit() {
    this.subscription = timer(0, 1000)
      .subscribe(() => {
        this.counter++;
        this.titleService.setTitle('Counter ' + this.counter);
      });
}

ngOnDestroy() {
    // Avoid side effects and memory leak by unsubscribing:
    this.subscription.unsubscribe();
}
```

However, it's not feasible for large applications with many subscriptions,
as it's cumbersome to write and introduces a lot of obfuscating code.

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
Thus memory leaks and unwanted side effects are avoided.

Drawbacks: As with the other methods, it's still quite verbose and error-prone.

Note: takeUntil operator should always come last (https://blog.angularindepth.com/rxjs-avoiding-takeuntil-leaks-fb5182d047ef)

