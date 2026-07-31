import { Request, Response } from "express";
import { CreateFacultyDto, GetAllFacultiesQueryDto } from "./faculties.dto";
import { createfacultyService, getAllFacultiesService } from "./faculties.services";

export const createFacultyController = async (req: Request, res: Response) => {
    const data = req.body as CreateFacultyDto;
    const faculty = await createfacultyService(data);
    res.status(201).json(faculty);
}

export const getAllFacultiesController = async (req: Request, res: Response) => {
    const query = req.query as GetAllFacultiesQueryDto;

    const faculties = await getAllFacultiesService(query);
    return res.status(200).json(faculties);
}