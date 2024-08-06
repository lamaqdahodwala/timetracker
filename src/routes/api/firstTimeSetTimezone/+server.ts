import { CreateAPIRoute } from "$lib/helpers/RouteFactory";
import { FirstTimeSetOffset } from "./FirstTimeSetTimezoneOffset";

export const POST = CreateAPIRoute.for(FirstTimeSetOffset)
