import { Request, Response } from "express";
import { CreateFacultyDto, GetAllFacultiesQueryDto } from "./faculties.dto";
import { createfacultyService, deleteFacultyService, getAllFacultiesService, getFacultyByIdService, restoreFacultyService, updateFacultyService } from "./faculties.services";

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

export const updateFacultyController = async (req: Request, res: Response) => {

    const { id } = req.params;
    const data = req.body as Partial<CreateFacultyDto>;

    const faculty = await updateFacultyService(id as string, data);
    return res.status(200).json(faculty);
}

export const deleteFacultyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const faculty = await deleteFacultyService(id as string);
    return res.status(200).json(faculty);
}

export const getFacultyByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const faculty = await getFacultyByIdService(id as string);
    return res.status(200).json(faculty);
}

export const restoreFacultyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const restoredFaculty = await restoreFacultyService(id as string);
    return res.status(200).json(restoredFaculty);
}