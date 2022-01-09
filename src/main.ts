import { InjectionToken, Injectable, Injector, Inject } from './di/index';

const token = new InjectionToken('new token');
const token1 = new InjectionToken('new token 1');

@Injectable()
class FirstService {
	public helloWorld(): void {
		console.log('Hello world!');
	}
}

@Injectable()
class SecondService {
	constructor(
		public firstService: FirstService, //
		@Inject(token) public value: number
	) {
		console.log(value);
	}

	public helloWorld(): void {
		this.firstService.helloWorld();
	}
}

const injectorParent = Injector.create([FirstService]);

const injector = Injector.create(
	[
		SecondService,
		{
			provide: token,
			useValue: 15,
		},
		{
			provide: token1,
			useValue: 123,
		},
	],
	injectorParent
);

const someService = injector.get<SecondService>(SecondService);

someService.helloWorld();
