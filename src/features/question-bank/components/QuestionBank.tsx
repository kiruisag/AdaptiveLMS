import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Copy, FileQuestion } from 'lucide-react';

const mockQuestions = [
  { id: '1', text: 'Which of the following is NOT a supervised learning algorithm?', type: 'multiple_choice', topic: 'Machine Learning Basics', difficulty: 'beginner' },
  { id: '2', text: 'Overfitting occurs when a model learns the training data too well, including its noise, but fails to generalize to new data.', type: 'true_false', topic: 'Model Evaluation', difficulty: 'intermediate' },
  { id: '3', text: 'What does "API" stand for?', type: 'short_answer', topic: 'Web Development', difficulty: 'beginner' },
  { id: '4', text: 'Explain the difference between a list and a tuple in Python.', type: 'essay', topic: 'Python', difficulty: 'intermediate' },
  { id: '5', text: 'Write a SQL query to find the second highest salary from an Employee table.', type: 'code', topic: 'Databases', difficulty: 'advanced' },
];

export function QuestionBank() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 mt-1">Manage and organize all assessment questions.</p>
        </div>
        <div className="flex gap-2">
           <button className="py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2">
             <Filter className="w-4 h-4" />
             <span>Filters</span>
           </button>
           <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
             <Plus className="w-4 h-4" />
             <span>Create Question</span>
           </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search questions by text or topic..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Question</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Topic</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Difficulty</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {mockQuestions.filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic.toLowerCase().includes(searchTerm.toLowerCase())).map((question) => (
                <tr key={question.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                       <FileQuestion className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                       <p className="text-sm font-medium text-slate-900 line-clamp-2">{question.text}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                      {question.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {question.topic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${question.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                        question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
                       <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1"><Copy className="w-4 h-4" /></button>
                       <button className="text-slate-400 hover:text-red-600 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
