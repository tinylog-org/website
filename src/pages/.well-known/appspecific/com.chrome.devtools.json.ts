import { resolve } from 'path'

export const GET = async () => {
    if (process.env.NODE_ENV !== 'development') return new Response(null)

    return new Response(
        JSON.stringify({
            workspace: {
                root: resolve('.'),
                uuid: '1332285b-e9e8-4b2c-8b25-4320169c1ba6',
            },
        }),
    )
}
