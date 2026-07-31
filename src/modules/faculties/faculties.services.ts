import prisma from "../../config/DB";
import { CreateFacultyDto } from "./faculties.dto";

export const createfacultyService = async (data:CreateFacultyDto)=>{

    const faculty = await prisma.faculty.create({
        data:{
            name:data.name,
            years: data.years ? {
                create:data.years
            } : undefined
        }
    });

    return faculty;
}