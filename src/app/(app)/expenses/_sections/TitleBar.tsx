import React, { ChangeEvent } from "react";

export default function TitleBar({
  onAdd,
  onExport,
  onImport,
}: {
  onAdd: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const pickFile = () => fileRef.current?.click();
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onImport(f);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <div className="flex items-center gap-2">
        <button onClick={onExport} className="btn btn-ghost">Export CSV</button>
        <button onClick={pickFile} className="btn btn-ghost">Import CSV</button>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFile} />
        <button onClick={onAdd} className="btn btn-primary">+ Add Expense</button>
      </div>
    </div>
  );
}
