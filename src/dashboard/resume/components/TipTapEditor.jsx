import React, { useState, useContext } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './tiptap.css';
import { Brain, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { toast } from 'sonner';
import { AIChatSession } from '../../../../services/AiModel';
import { Loader } from 'lucide-react';

const PROMPT_TEMPLATE = 'position title : {positionTitle} , Depends on position title give me 5-7 lines of summary for my experience in resume, give me result in HTML format, give your response in bold and summary only with normal text';


const TiptapEditor = ({ content, onChange, index }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
const [loading,setLoading]=useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const GenerateSummaryFromAI = async () => {
    setLoading(true);
    const positionTitle = resumeInfo.experience[index]?.title;
    if (!positionTitle) {
      toast('Please Add Position Title');
      setLoading(false);
      return;
    }

    const prompt = PROMPT_TEMPLATE.replace('{positionTitle}', positionTitle);
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = await result.response.text();
      editor.commands.setContent(rawText); // Set the AI result into editor
      toast.success('AI summary generated!');
    } catch (err) {
      console.error('Error generating summary:', err);
      toast.error('Failed to generate AI summary');
    }
    setLoading(false);
  };

  if (!editor) return null;

  return (
    <div>
      <div className='flex justify-between my-2'>
        <span className='text-xs'>Enter your experience Summary</span>
        <Button onClick={GenerateSummaryFromAI} variant="outline" size="sm" className="flex border-primary text-primary gap-2 m-2 ml-0">
          {loading?
          <LoaderCircle className='animate-spin'/> :<><Brain className="h-4 w-4" /> Generate from AI</>  
        }
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-2 col-span-2 bg-gray-100 p-2 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'btn-active' : 'btn'}
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'btn-active' : 'btn'}
        >
          <i>I</i>
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
