import { InjectionToken, Injectable, Injector, Inject } from './di/index';

const token = new InjectionToken('token for non unique providers');

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
			useValue: 'First value',
		},
		{
			provide: token,
			useValue: 'Second value',
		},
	],
	injectorParent
);

const someService = injector.get<SecondService>(SecondService);

someService.helloWorld();
