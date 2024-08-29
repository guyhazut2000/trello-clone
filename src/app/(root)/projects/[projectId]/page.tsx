import { getProjectById } from "@/data-access/projects";
import { CreateTaskSheet } from "../_components/create-task-sheet";
import { Label } from "@/components/ui/label";
import { ListTodo } from "lucide-react";
import { getListsByProjectId } from "@/data-access/lists";
import { CreateProjectListSheet } from "../_components/create-project-list-sheet";
import { Button } from "@/components/ui/button";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
  const project = await getProjectById(params.projectId);
  const lists = await getListsByProjectId(params.projectId);

  return (
    <div className="flex flex-col space-y-4 py-4 w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <h2 className="font-bold text-2xl">{project?.title}</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <Label>description:</Label>
          <p>{project?.description}</p>
        </div>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-x-2 items-center">
            <ListTodo className="w-5 h-5" />
            Work items
          </div>
          <CreateProjectListSheet
            projectId={params.projectId}
            type={"button"}
          />
        </div>
        <section className="mt-10">
          {lists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {lists?.map((list) => (
                <div
                  key={list.id}
                  className="bg-gray-100 rounded-sm flex gap-2 items-start"
                >
                  {list.title}
                </div>
              ))}
            </div>
          ) : (
            <CreateProjectListSheet projectId={params.projectId} />
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectPage;
