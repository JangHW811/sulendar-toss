// @ts-expect-error - Granite specific require.context
export const context = require.context('./pages', true, /\.(ts|tsx)$/);
