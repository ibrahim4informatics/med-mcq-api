import prisma from "../../config/DB";
import { BadRequestError } from "../../shared/errors/bad-request";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { unlink } from "fs/promises";
import path from "path";
import {
  GetAllModulesQueryDto,
  UpdateModuleDto,
  type CreateModuleDto,
} from "./modules.dto";
export const createModuleService = async (
  data: CreateModuleDto,
  file: Express.Multer.File,
) => {
  const { name, description, year_id, chapters } = data;
  console.log(file);
  const module = await prisma.module.create({
    data: {
      name,
      description,
      illustration: `${file.destination}/${file.filename}`,
      year_id,
      chapters: {
        createMany: chapters ? { data: chapters } : undefined,
      },
    },
  });
  return module;
};

export const getAllModulesService = async (
  query: GetAllModulesQueryDto,
  role: string,
) => {
  const { cursor, limit, name, year_id } = query;
  const takeLimit = limit ? parseInt(limit) : 20;
  const modules = await prisma.module.findMany({
    take: takeLimit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      year_id: year_id ? year_id : undefined,
      deleted_at: role === "ADMIN" ? undefined : null,
    },
    include: {
      _count: {
        select: {
          chapters: true,
        },
      },
      year: {
        select: {
          id: true,
          name: true,
          faculty:{
            select:{
                id:true,
                name:true
            }
          }
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  const has_more = modules.length > takeLimit;
  if (has_more) {
    modules.pop();
  }
  return {
    modules,
    has_more,
    next_cursor: has_more ? modules[modules.length - 1].id : null,
  };
};

export const getModuleByIdService = async (id: string, role:string) => {
  const module = await prisma.module.findUnique({
    where: { id, deleted_at: role === "ADMIN" ? undefined : null },
    include: {
      chapters: true,
      year: {
        select: {
          id: true,
          name: true,
          faculty: true,
        },
      },
    },
  });

  if (!module) throw new NotFoundError("Module not found");
  return module;
};

export const updateModuleService = async (
  id: string,
  data: UpdateModuleDto,
) => {
  const existingChapters = data.chapters?.filter((chapter) => chapter.id);
  const newChapters = data.chapters?.filter((chapter) => !chapter.id);
  const module = await prisma.module.update({
    where: { id },
    data: {
      ...data,

      chapters: {
        update: existingChapters
          ? existingChapters.map((chapter) => ({
              where: { id: chapter.id },
              data: { title: chapter.title },
            }))
          : undefined,
        createMany: newChapters
          ? { data: newChapters.map((chapter) => ({ title: chapter.title , order:chapter.order})) }
          : undefined,
      },
    },
  });
  return module;
};

export const deleteModuleService = async (id: string) => {
  const module = await prisma.module.findUnique({
    where: { id },
    select: { id: true, deleted_at: true },
  });

  if (!module) throw new NotFoundError("Module not found");
  if (module.deleted_at) throw new BadRequestError("Module already deleted");

  await prisma.module.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export const restoreModuleService = async (id: string) => {
  const module = await prisma.module.findUnique({
    where: { id },
    select: { id: true, deleted_at: true },
  });

  if (!module) throw new NotFoundError("Module not found");
  if (!module.deleted_at) throw new BadRequestError("Module is not deleted");

  await prisma.module.update({
    where: { id },
    data: { deleted_at: null },
  });
};

export const uploadModuleIllustrationService = async (
  id: string,
  file: Express.Multer.File,
) => {
  const module = await prisma.module.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!module) throw new NotFoundError("Module not found");

  const updatedModule = await prisma.module.update({
    where: { id },
    data: { illustration: `${file.destination}/${file.filename}` },
  });

  return updatedModule;
};

export const deleteModuleIllustrationService = async (id: string) => {
  const module = await prisma.module.findUnique({
    where: { id },
    select: { id: true, illustration: true },
  });

  if (!module) throw new NotFoundError("Module not found");
  if (!module.illustration)
    throw new BadRequestError("Module does not have an illustration");

  await unlink(module.illustration);
  const updatedModule = await prisma.module.update({
    where: { id },
    data: { illustration: null },
  });

  return updatedModule;
};
