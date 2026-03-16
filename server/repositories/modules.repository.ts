import { and, eq } from "drizzle-orm";
import db from "~~/lib/db";
import { module } from "~~/lib/db/schema";

export async function getModuleWithDetailedAssessments(userId: number, year: number, semester: number) {
    return db.query.module.findMany({
        where: and(
            eq(module.userId, userId),
            eq(module.year, year),
            eq(module.semester, semester),
        ),
        columns: {
            id: true,
            code: true,
            name: true,
            semester: true,
            year: true,
            createdAt: true,
            updatedAt: true,
        },
        with: {
            assessments: {
                columns: {
                    id: true,
                    slug: true,
                    name: true,
                    description: true,
                    releasedAt: true,
                    dueAt: true,
                    isCompleted: true,
                    createdAt: true,
                    updatedAt: true,
                    moduleId: true,
                },
                with: {
                    tasks: {
                        columns: {
                            id: true,
                            name: true,
                            description: true,
                            dueAt: true,
                            isCompleted: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            }
        }
    });
}