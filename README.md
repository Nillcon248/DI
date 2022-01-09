# DI 🎎
Custom Dependency injection for TypeScript. Was made for deeper learning Angular.

# Quick usage reference

Wrap classes into ```Injectable``` decorator.
```js
@Injectable()
class FirstService {}

@Injectable()
class SecondService {}
```

Use static method ```create```  in ```Injector``` class for create injector with DI scope.

```js
const injector = Injector.create(
	[
		FirstService,
		SecondService
	],
);
```

For inject one class into another, set injectable class into constructor of class where you want to inject.

```js
@Injectable()
class SecondService {
	constructor(
		private readonly firstService: FirstService
	) {}
}
```

Use method ```get``` in created ```injector``` for get some instance.
```js
const secondService = injector.get<SecondService>(SecondService);
```

# Provide by token
You can create token and provide ```class|value|factory```.

```js
const token = new InjectionToken('some description');

const injector = Injector.create(
	[
		...
		{
			provide: token,
			useValue: 'some text'
		},
	],
);
```

And for provide it into class use ```@Inject``` decorator.

```js
@Injectable()
class SecondService {
	constructor(
		@Inject(token)
		private readonly someText: string
	) {}
}
```

# Multi providers
You can provide some providers by one token, then you will get array of values.

```js
const injector = Injector.create(
	[
		...
		{
			provide: token,
			useValue: 'some text'
		},
			{
			provide: token,
			useValue: 'some new text'
		},
	],
);

@Injectable()
class SecondService {
	constructor(
		@Inject(token)
		private readonly someText: string
	) {
		console.log(this.someText); // ['some text', 'some new text']
	}
}
```
