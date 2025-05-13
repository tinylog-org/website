import { resolve } from 'path'

export const GET = process.env.NODE_ENV === 'development'
    ? async () => {
        return new Response(
            JSON.stringify({
                workspace: {
                    root: resolve('.'),
                    uuid: '1332285b-e9e8-4b2c-8b25-4320169c1ba6',
                },
            }),
        )
    }
    : undefined
