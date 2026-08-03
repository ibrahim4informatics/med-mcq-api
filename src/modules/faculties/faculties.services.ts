import prisma from "../../config/DB";
import { BadRequestError } from "../../shared/errors/bad-request";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { CreateFacultyDto, GetAllFacultiesQueryDto } from "./faculties.dto";

export const createfacultyService = async (data: CreateFacultyDto) => {

    const faculty = await prisma.faculty.create({
        data: {
            name: data.name,
            years: data.years ? {
                create: data.years.map(year => ({ name: year.name }))
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

export const updateFacultyService = async (id: string, data: Partial<CreateFacultyDto>) => {
    const facultyExists = await prisma.faculty.findUnique({
        where: { id },
    });
    if (!facultyExists) throw new NotFoundError("Faculty not found");
    if (facultyExists.deleted_at) throw new BadRequestError("Faculty is deleted, cannot update");

    const existingYears = data.years && data.years?.filter(y => y.id);
    const newYears = data.years && data.years?.filter(y => !y.id);
    const faculty = await prisma.faculty.update({
        where: { id },
        data: {
            name: data.name,
            years: {
                update: existingYears ? existingYears.map(y => ({ where: { id: y.id }, data: y })) : undefined,
                createMany: newYears ? { data: newYears.map(y => ({ name: y.name })) } : undefined
            }

        },

        include: {
            _count: {
                select: {
                    years: true
                }
            }
        }
    })
    return faculty;
}

export const deleteFacultyService = async (id: string) => {
    const faculty = await prisma.faculty.findUnique({
        where: { id },
    });
    if (!faculty) throw new NotFoundError("Faculty not found");
    if (faculty.deleted_at) throw new BadRequestError("Faculty already deleted");
    const deleted_faculty = await prisma.faculty.update({
        where: { id },
        data: {
            deleted_at: new Date()
        }
    });
    return deleted_faculty;
}

export const restoreFacultyService = async (id: string) => {
    const faculty = await prisma.faculty.findUnique({
        where: { id },
    });
    if (!faculty || !faculty.deleted_at) throw new NotFoundError("Faculty not found");

    const restoredFaculty = await prisma.faculty.update({
        where: { id },
        data: {
            deleted_at: null
        }
    });
    return restoredFaculty;
}

export const getFacultyByIdService = async (id: string) => {

    const faculty = await prisma.faculty.findUnique({
        where: { id },
        include: {
            years: true
        }
    });
    if (!faculty) throw new NotFoundError("Faculty not found");
    return faculty;
}


export const deleteRelatedYearService = async (faculty_id: string, year_id: string) => {
    const year = await prisma.year.findUnique({
        where: { id: year_id },
    });
    if (!year || year.deleted_at) throw new NotFoundError("Year not found");
    if (year.faculty_id !== faculty_id) throw new BadRequestError("Year does not belong to the specified faculty");
    const deleted_year = await prisma.year.update({
        where: { id: year_id },
        data: {
            deleted_at: new Date()
        }
    });
    return deleted_year;
}

export const restoreRelatedYearService = async (faculty_id: string, year_id: string) => {
    const year = await prisma.year.findUnique({
        where: { id: year_id },
    });
    if (!year || !year.deleted_at) throw new NotFoundError("Year not found");
    if (year.faculty_id !== faculty_id) throw new BadRequestError("Year does not belong to the specified faculty");
    const restored_year = await prisma.year.update({
        where: { id: year_id },
        data: {
            deleted_at: null
        }
    });
    return restored_year;
}