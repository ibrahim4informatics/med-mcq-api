import { Request, Response } from "express";
import { CreateModuleDto, GetAllModulesQueryDto, UpdateModuleDto } from "./modules.dto";
import { createModuleService, deleteModuleIllustrationService, deleteModuleService, getAllModulesService, getModuleByIdService, restoreModuleService, updateModuleService, uploadModuleIllustrationService } from "./modules.services";

export const createModuleController = async (req:Request, res:Response)=>{
    const data:CreateModuleDto = req.body;
    const file = req.file as Express.Multer.File;
    const module = await createModuleService(data, file);
    return res.status(201).json({message:"Module created successfully", module});
}

export const getAllModulesController = async (req:Request, res:Response)=>{
    const query = req.query as GetAllModulesQueryDto;
    const role = req.user?.role || "STUDENT"; // Assuming you have user info in req.user
    const modules = await getAllModulesService(query, role);
    return res.status(200).json(modules);
}

export const getModuleByIdController = async (req:Request, res:Response)=>{
    const {id} = req.params as { id: string };
    const module = await getModuleByIdService(id);
    return res.status(200).json(module);
}

export const updateModuleController = async (req:Request, res:Response)=>{
    const {id} = req.params as { id: string };
    const data = req.body as UpdateModuleDto;
    const module = await updateModuleService(id, data);
    return res.status(200).json({message:"Module updated successfully", module});
}

export const deleteModuleController = async (req:Request, res:Response)=>{
    const {id} = req.params as { id: string };
    await deleteModuleService(id);
    return res.status(200).json({message:"Module deleted successfully"});
}

export const restoreModuleController = async (req:Request, res:Response)=>{
    const {id} = req.params as { id: string };
    await restoreModuleService(id);
    return res.status(200).json({message:"Module restored successfully"});
}

export const uploadModuleIllustrationController = async (req:Request, res:Response)=>{
    const {id} = req.params as { id: string };
    const file = req.file as Express.Multer.File;
    await uploadModuleIllustrationService(id, file);
    return res.status(200).json({message:"Module illustration uploaded successfully"});
}

export const deleteModuleIllustrationController = async (req:Request, res:Response)=>{
    const {id} = req.params as { id: string };
    await deleteModuleIllustrationService(id);
    return res.status(200).json({message:"Module illustration deleted successfully"});
}