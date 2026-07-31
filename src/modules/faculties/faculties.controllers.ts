import { Request, Response } from "express";
import { CreateFacultyDto } from "./faculties.dto";
import { createfacultyService } from "./faculties.services";

export const createFacultyController = async (req: Request, res: Response) => {
    const data = req.body as CreateFacultyDto;
    const faculty = await createfacultyService(data);
    res.status(201).json(faculty);
}