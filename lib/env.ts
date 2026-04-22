import "dotenv/config";
import { z, ZodError, ZodObject, type ZodRawShape } from "zod";

function tryParseEnv<T extends ZodRawShape>(
    EnvSchema: ZodObject<T>,
    buildEnv: Record<string, string | undefined> = process.env,
) {
    try {
        EnvSchema.parse(buildEnv);
    } catch (error) {
        if (error instanceof ZodError) {
            let message = 'Missing required values in .env:\n';
            error.issues.forEach((issue) => {
                message += `${String(issue.path[0])}\n`;
            });

            const e = new Error(message);
            e.stack = '';
            throw e;
        } else {
            throw error;
        }
    }
}

const EnvSchema = z.object({
    NODE_ENV: z.string(),
    
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    RESEND_API_KEY: z.string(),
});

tryParseEnv(EnvSchema);

export default EnvSchema.parse(process.env);