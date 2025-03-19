"use client";

import { useState } from "react";

interface Student {
  id: number;
  name: string;
  math: number;
  physics: number;
  chemistry: number;
}

interface ExamForm {
  examName: string;
  subjects: string[];
}

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "John Doe", math: 85, physics: 90, chemistry: 88 },
    { id: 2, name: "Jane Smith", math: 78, physics: 85, chemistry: 92 },
  ]);

  const [examForm, setExamForm] = useState<ExamForm>({
    examName: "1",
    subjects: [],
  });

  const examOptions: string[] = ["1", "2", "3", "4", "5", "6"];
  const subjects: string[] = ["Mathematics", "Physics", "Chemistry"];

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExamForm({ ...examForm, examName: e.target.value });
  };

  const handleSubjectChange = (subject: string) => {
    setExamForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Exam Application Submitted:", examForm);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Marks Sheet</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Index</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Math</th>
            <th className="border p-2">Physics</th>
            <th className="border p-2">Chemistry</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="text-center border">
              <td className="border p-2">{student.id}</td>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">{student.math}</td>
              <td className="border p-2">{student.physics}</td>
              <td className="border p-2">{student.chemistry}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-6">Exam Application Form</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="block">
          <span className="text-gray-700">Exam Name:</span>
          <select
            value={examForm.examName}
            onChange={handleExamChange}
            className="mt-1 block w-full border rounded p-2"
          >
            {examOptions.map((exam) => (
              <option key={exam} value={exam}>{`Exam ${exam}`}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-gray-700">Subjects:</legend>
          <div className="mt-2 space-y-2">
            {subjects.map((subject) => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={examForm.subjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Application
        </button>
      </form>
    </div>
  );
}
