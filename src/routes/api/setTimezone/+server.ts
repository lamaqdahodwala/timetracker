import { CreateAPIRoute } from "$lib/helpers/RouteFactory";
import { SetTimezoneOffset } from "./SetOffset";

export const POST = CreateAPIRoute.for(SetTimezoneOffset)
