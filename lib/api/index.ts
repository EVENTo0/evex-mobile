/**
 * EVEX API - Unified exports
 * All service clients are isolated but exported from a single entry point.
 */
export { labApi } from "./lab";
export { fitApi } from "./fit";
export { coachApi } from "./coach";
export { ramadanApi } from "./ramadan";
export { halalApi } from "./halal";
export { createApiClient } from "./client";
export type { ApiError } from "./client";
