import React, { useEffect, useState } from "react";
import "./TaskForm.css";
import { type Task } from "../../types/common";

type TaskProps = {
  activeTask: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
};

export function TaskForm({ activeTask, onSave, onCancel }: TaskProps) {
  // Lokální stav pro formulář

  console.log("activeTask 1st render:", activeTask);

  const [formData, setFormData] = useState<Task>(activeTask);

  // Aktualizace formuláře, když se změní activeTask (při kliknutí na jiný úkol)
  useEffect(() => {
    setFormData(activeTask);
  }, [activeTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "form data jsou jmeno: " +
        formData.name +
        " " +
        formData.details +
        " " +
        formData.id +
        " " +
        formData.done,
    );
    onSave(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="taskForm">
      <h2>{formData.id > 0 ? "Editace úkolu" : "Nový úkol"}</h2>
      <div>
        <label>Název:</label>
        <input
          type="text"
          placeholder="Název úkolu"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label>Detaily:</label>
        <input
          type="text"
          placeholder="Popis"
          value={formData.details}
          onChange={(e) =>
            setFormData({ ...formData, details: e.target.value })
          }
        />
      </div>

      <div className="buttons">
        <button type="button" onClick={onCancel}>
          Zrušit
        </button>
        <button type="submit">Uložit</button>
      </div>
    </form>
  );
}
