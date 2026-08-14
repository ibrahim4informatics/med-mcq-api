import { Request, Response } from "express";
import { CreateChapterDto, GetChaptersQueryDto } from "./chapters.dto";
import { createChapterService, deleteChapterService, getChapterByIdService, getChaptersService, restoreChapterService, updateChapterService } from "./chapters.services";

export const getChaptersController = async (req: Request, res: Response) => {
    const query = req.query as GetChaptersQueryDto;
    const role = req.user?.role || "STUDENT";
    const chapters = await getChaptersService(query, role);
    return res.status(200).json(chapters);
}


export const getChapterByIdController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const role = req.user?.role || "STUDENT";
    const chapter = await getChapterByIdService(parseInt(id), role);
    return res.status(200).json(chapter);
}


export const createChapterController = async (req: Request, res: Response) => {
    const data = req.body as CreateChapterDto;
    const chapter = await createChapterService(data);
    return res.status(201).json({ message: "Chapter created successfully", chapter });
}

export const updateChapterController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const data = req.body as Partial<CreateChapterDto>;
    const chapter = await updateChapterService(parseInt(id), data);
    return res.status(200).json({ message: "Chapter updated successfully", chapter });
}

export const deleteChapterController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await deleteChapterService(parseInt(id));
    return res.status(200).json({ message: "Chapter deleted successfully" });
}

export const restoreChapterController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await restoreChapterService(parseInt(id));
    return res.status(200).json({ message: "Chapter restored successfully" });
}