import { walk } from "https://deno.land/std@0.177.0/fs/walk.ts";
import { serve } from "https://deno.land/std@0.173.0/http/server.ts";

async function find(name: string) {
    for await (const e of walk("./l")) {
        if (e.name === name) {
            return e.path;
        }
    }
    return "";
}

const headers = {
    "content-type": "text/plain",
    "access-control-allow-origin": "*",
};

async function handler(req: Request) {
    const file = (new URL(req.url).pathname).substring(1);
    const path = await find(file);
    if ("" === path) {
        return new Response("not found", {
            status: 404,
            headers
        });
    }
    const ldr = await Deno.readTextFile(path);
    return new Response(ldr, {headers})
}

await serve(handler);
