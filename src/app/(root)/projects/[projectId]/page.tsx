import { getProjectById } from "@/data-access/projects";
import { CreateTaskSheet } from "../_components/create-task-sheet";
import { Label } from "@/components/ui/label";
import { ListTodo } from "lucide-react";
import { getListsByProjectId } from "@/data-access/lists";
import { CreateProjectListSheet } from "../_components/create-project-list-sheet";

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
          <Label>תיאור:</Label>
          <p>{project?.description}</p>
        </div>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-x-2 items-center">
            <ListTodo className="w-5 h-5" />
            פריטי עבודה
          </div>
          <CreateProjectListSheet
            projectId={params.projectId}
            type={"button"}
          />
        </div>
        <section className="mt-10">
          <div className="flex overflow-x-auto gap-4 pb-4">
            {lists.length > 0 ? (
              lists?.map((list) => (
                <div
                  key={list.id}
                  className="bg-gray-50 rounded-sm flex flex-col gap-2 p-4 min-w-[250px]"
                >
                  <h3 className="font-semibold">{list.title}</h3>
                  <div className="space-y-2">
                    <div>
                      {list.tasks.map((task) => {
                        return <p key={task.id}>{task.title}</p>;
                      })}
                    </div>
                  </div>
                  <CreateTaskSheet
                    listId={list.id}
                    projectId={params.projectId}
                  />
                </div>
              ))
            ) : (
              <CreateProjectListSheet projectId={params.projectId} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectPage;
