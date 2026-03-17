// https://jamiecurnow.medium.com/nuxt-3-server-routes-and-typescript-4fa361d738a3

import type { InternalApi } from 'nitropack'
export type ApiRoutes = keyof InternalApi

export type ApiResponse<T extends ApiRoutes, M extends keyof InternalApi[T]> = InternalApi[T][M]

export type ModuleWithAssessments = Awaited<ApiResponse<'/api/schedule', 'get'>>[number];
export type AssessmentWithTasks = ModuleWithAssessments['assessments'][number];