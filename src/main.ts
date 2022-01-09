import { InjectionToken } from "./di/injection-token";
import { Injectable } from "./di/injectable";
import { Injector } from "./di/injector";
import { Inject } from "./di/inject";

const token = new InjectionToken("new token");

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

const injector = Injector.resolve([
	SomeService,
	LolService,
	{
		provide: token,
		useValue: 15,
	},
]);

const someService: SomeService = injector.get(SomeService);

someService.helloWorld();
