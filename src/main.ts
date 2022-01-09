import { InjectionToken } from "./di/injection-token";
import { Injectable } from "./di/injectable.decorator";
import { Injector } from "./di/injector";
import { Inject } from "./di/inject.decorator";

const token = new InjectionToken("new token");
const token1 = new InjectionToken("new token 1");

@Injectable()
class LolService {
	public hello(): void {
		console.log("Hello world!");
	}
}

@Injectable()
class SomeService {
	constructor(
		public lol: LolService, //
		@Inject(token) public value: number
	) {
		console.log(value);
	}

	public helloWorld(): void {
		this.lol.hello();
	}
}

const injector = Injector.create([
	SomeService,
	LolService,
	{
		provide: token,
		useValue: 15,
	},
	{
		provide: token,
		useValue: 123,
	},
]);

const someService: SomeService = injector.get<SomeService>(SomeService);

someService.helloWorld();
