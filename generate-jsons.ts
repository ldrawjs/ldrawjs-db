import { walk } from "https://deno.land/std@0.177.0/fs/walk.ts";

// generate parsed JSON files of LDRaw dat files
// deno run --allow-read --allow-write generate-jsons.ts

const OPTS = {includeDirs: false};
const DOT = new TextEncoder().encode(".");

function parse(text: string) {
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => '' !== line)
        .map(line => line.split(/\s+/))
        .map(([type, ...parts]) => {
            const t = parseFloat(type);
            if (0 === t) {
                return [t, ...parts];
            }
            if (1 === t) {
                const part = parts.pop() as string;
                return [t, ...parts.map(t => parseFloat(t)), part];
            }
            return [t, ...parts.map(t => parseFloat(t))];
        });
}

for await (const entry of walk(".", OPTS)) {
    if (!entry.path.endsWith('.dat')) {
        continue;
    }
    const raw = await Deno.readTextFile(entry.path);
    const parsed = parse(raw);
    const target = entry.path.replace('.dat', '.json');

    await Deno.writeTextFile(target, JSON.stringify(parsed), {create: true});
    await Deno.stdout.write(DOT);
}

console.log('\ndone.\n');
