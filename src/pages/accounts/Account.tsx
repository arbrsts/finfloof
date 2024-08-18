import App from "../../components/Table/Table";

export const Accounts = () => {
  return (
    <div>
      <div className="bg-finfloof-background">
        <h1 className="text-finfloof-text-primary text-2xl font-bold">
          August 2024
        </h1>

        <button className="bg-finfloof-primary font-medium text-finfloof-background px-4 py-2 rounded">
          New Transaction
        </button>
        <span className="text-finfloof-text-muted">
          Last updated: 2 hours ago
        </span>
      </div>

      <div className="mt-4">
        <App />
      </div>
    </div>
  );
};
