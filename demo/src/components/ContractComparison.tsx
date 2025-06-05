import type { DragEvent, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type FileSlot = 'left' | 'right';

type DiffBlock = {
  type: 'add' | 'remove' | 'edit' | 'same';
  leftText?: string;
  rightText?: string;
  comment?: string;
};

export default function ContractComparison() {
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileDrop = (e: DragEvent<HTMLDivElement>, slot: FileSlot) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (slot === 'left') setLeftFile(file);
    else setRightFile(file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, slot: FileSlot) => {
    const file = e.target.files?.[0];
    if (file) {
      if (slot === 'left') setLeftFile(file);
      else setRightFile(file);
    }
  };

  const preventDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const mockCompareContracts = async (): Promise<DiffBlock[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([
        { type: 'same', leftText: 'Overview of LangChain Framework', rightText: 'Overview of LangChain Framework' },
        { type: 'edit', leftText: 'Core Features', rightText: 'Key Features', comment: 'Heading changed' },
        { type: 'add', rightText: 'New innovative guide section', comment: 'New section added' },
        { type: 'remove', leftText: 'Legacy deployment details', comment: 'Removed deprecated content' },
      ]), 1500)
    );
  };

  const handleCompare = async () => {
    if (!leftFile || !rightFile) return alert('Please upload both files.');

    try {
      setLoading(true);

      const diffs = await mockCompareContracts();

      // ✅ Navigate to result page with the diffs
      navigate('/results', { state: { diffs } });
    } catch (error) {
      console.error('Comparison failed:', error);
      alert('An error occurred during comparison.');
    } finally {
      setLoading(false);
    }
  };

  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);

  const removeFile = (slot: FileSlot) => {
    if (slot === 'left') {
      setLeftFile(null);
      if (leftInputRef.current) leftInputRef.current.value = '';
    } else {
      setRightFile(null);
      if (rightInputRef.current) rightInputRef.current.value = '';
    }
  };

  const renderDropZone = (slot: FileSlot, file: File | null) => (
    <div
      onDrop={(e) => handleFileDrop(e, slot)}
      onDragOver={preventDefaults}
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg w-[650px] h-[600px] transition-all hover:border-orange-400 hover:bg-orange-500/20 duration-1000"
    >
      <p className="text-gray-500 text-sm mb-2">Drag and Drop File</p>
      <input
        ref={slot === 'left' ? leftInputRef : rightInputRef}
        type="file"
        id={`upload-${slot}`}
        className="hidden"
        onChange={(e) => handleFileSelect(e, slot)}
        accept=".pdf,.docx,.txt"
      />
      <p className='text-gray-50 mb-3'>or</p>
      <label
        htmlFor={`upload-${slot}`}
        className="px-4 py-2 bg-orange-500 text-black text-sm font-medium rounded cursor-pointer hover:bg-orange-600 transition"
      >
        Select File
      </label>
      {file && (
        <div className="mt-5 flex items-center space-x-2">
          <p className="text-sm text-green-600 truncate max-w-[500px]">{file.name}</p>
          <button
            type="button"
            onClick={() => removeFile(slot)}
            className="text-red-600 hover:text-red-800 text-xs font-semibold"
            aria-label={`Remove ${slot} file`}
          >
            ✕ Remove
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="flex items-center mb-8 mx-9">
        <Link to="/" className="text-4xl font-bold text-orange-500">Verdicto</Link>
      </div>

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className='flex justify-center items-center'>
          {renderDropZone('left', leftFile)}
        </div>
        <div className='flex justify-center items-center'>
          {renderDropZone('right', rightFile)}
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleCompare}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 text-black font-medium px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </div>
    </div>
  );
}
