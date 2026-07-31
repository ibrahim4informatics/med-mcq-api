import prisma from "../../config/DB";
import { CreateFacultyDto, GetAllFacultiesQueryDto } from "./faculties.dto";

export const createfacultyService = async (data: CreateFacultyDto) => {

    const faculty = await prisma.faculty.create({
        data: {
            name: data.name,
            years: data.years ? {
                create: data.years
            } : undefined
        }
    });

    return faculty;
}

export const getAllFacultiesService = async (query: GetAllFacultiesQueryDto) => {
    const { cursor, name, limit = 20 } = query;
    const faculties = await prisma.faculty.findMany({
        where: {
            name: name ? {
                contains: name,
            } : undefined
        },
        take: parseInt(limit.toString()) + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
            _count: {
                select: {
                    years: true
                }
            }
        },
        orderBy: [
            { created_at: "desc" },
        ]
    });
    const has_more = faculties.length > parseInt(limit.toString());
    if (has_more) {
        faculties.pop();
    }
    const next_cursor = has_more ? faculties[faculties.length - 1].id : null;

     
    return {
        data: faculties,
        has_more,
        next_cursor
    };
}