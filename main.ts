import { walk } from "https://deno.land/std@0.177.0/fs/walk.ts";

async function find(name: string) {
    for await (const e of walk("./l")) {
        if (e.name === name) {
            return e.path;
        }
    }
    return "";
}



console.log(await find("3005.dat"));
