import { CreateTaskSheet } from "../_components/create-task-sheet";

const BoardPage = ({ params }: { params: { projectId: string } }) => {
  return (
    <div className="flex flex-col space-y-4 py-4 w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <h2 className="text-3xl font-bold">Work items</h2>
        {/* TODO: add view as board or table. */}
        <CreateTaskSheet />
      </div>

      <div>{params.projectId}</div>
    </div>
  );
};

export default BoardPage;
