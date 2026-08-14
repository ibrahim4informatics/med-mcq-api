import prisma from "../../config/DB";
import { BadRequestError } from "../../shared/errors/bad-request";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { CreateChapterDto, GetChaptersQueryDto } from "./chapters.dto";

export const createChapterService = async (data: CreateChapterDto) => {
  const newModule = await prisma.chapter.create({ data });
  return newModule;
};

export const getChaptersService = async (query: GetChaptersQueryDto, role: string) => {
  const { module_id, page = "1", limit } = query;
  const takeLimit = limit ? parseInt(limit) : 20;
  const skip = (parseInt(page) - 1) * takeLimit;
  const chapters = await prisma.chapter.findMany({
    take: takeLimit + 1,
    skip,
    where: {
      module_id: module_id ? module_id : undefined,
      deleted_at: role === "ADMIN" ? undefined : null,
    },
    orderBy: {
      order: "asc",
    },
  });

  const has_more = chapters.length > takeLimit;
  if (has_more) {
    chapters.pop();
  }

  return {
    chapters,
    has_more,
    page: parseInt(page),
  };
};
export const getChapterByIdService = async (id: number, role: string) => {
    const chapter = await prisma.chapter.findUnique({
      where: { id , deleted_at: role === "ADMIN" ? undefined : null },
      include:{
        module:{
            select:{
                id:true,
                name:true
            }
        }
      }
    });
    if(!chapter) throw new NotFoundError("Chapter not found");
    return chapter;
};

export const updateChapterService = async (
  id: number,
  data: Partial<CreateChapterDto>,
) => {

    const chapter = await prisma.chapter.findUnique({
        where:{id}
    });

    if(!chapter || chapter.deleted_at) throw new NotFoundError("Chapter not found");
    const updatedChapter = await prisma.chapter.update({
        where:{id},
        data
    });
    return updatedChapter;
};


export const deleteChapterService = async (id: number) => {
    const chapter = await prisma.chapter.findUnique({
        where:{id}
    });

    if(!chapter) throw new NotFoundError("Chapter not found");
    if(chapter.deleted_at) throw new BadRequestError("Chapter is already deleted");
    await prisma.chapter.update({
        where:{id},
        data:{
            deleted_at:new Date()
        }
    });
};

export const restoreChapterService = async (id: number) => {
    const chapter = await prisma.chapter.findUnique({
        where:{id}
    });

    if(!chapter) throw new NotFoundError("Chapter not found");
    if(!chapter.deleted_at) throw new BadRequestError("Chapter is not deleted");
    await prisma.chapter.update({
        where:{id},
        data:{
            deleted_at:null
        }
    });
}