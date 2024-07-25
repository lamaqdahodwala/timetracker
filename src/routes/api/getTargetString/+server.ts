import {CreateAPIRoute} from '$lib/helpers/RouteFactory'
import { GetTargetInfo } from './GetTargetInfo'

export const GET = CreateAPIRoute.for(GetTargetInfo)
